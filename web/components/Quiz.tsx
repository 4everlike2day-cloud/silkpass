'use client'
import Script from 'next/script'
import {useCallback, useEffect, useRef, useState} from 'react'
import {BOT, botLink} from '@/lib/places'

// Викторина «Насколько ты знаешь Узбекистан?»: welcome2.uz/quiz (EN) и /ru/quiz.
// Работает и на сайте, и внутри Telegram как Mini App бота @w2uz_bot (кнопка «🎯 Викторина»).
// Вопросы выдаёт по одному /api/quiz (functions/api/quiz.ts): ответы проверяет сервер, он же считает время,
// поэтому правильных ответов в браузере нет и рейтинг честный.
// Итог: картинка /quiz/story/<язык>-<режим>-<счёт>.jpg → «В сторис», «Бросить вызов другу», «Скачать»,
// и в Telegram — галочка «Показать меня в рейтинге» (топ-10 по каждому режиму, ник из Telegram).

export type QuizLang = 'en' | 'ru'
type Mode = 'tourist' | 'local'
type Shown = {token: string; i: number; total: number; question: {q: string; options: string[]}}
type Checked = {correct: number; ok: boolean; explain: string; place: string; done: boolean; token?: string; score?: number; ms?: number; result?: string}
type TopRow = {nick: string; score: number; sec: number}
type Info = {counts: Record<Mode, Record<QuizLang, number>>; top: Record<Mode, TopRow[]>}

const SITE = 'https://welcome2.uz'
const QUIZ_LINK = `https://t.me/${BOT}?start=quiz`

const TX = {
  en: {
    label: 'Quiz', title: 'How well do you know Uzbekistan?',
    lead: '10 questions about cities, history, food and traditions. After each answer — a short story and a place to see it with your own eyes.',
    modes: {tourist: ['🧳 Tourist', 'The famous sights and first steps'], local: ['🏡 Local', 'Harder: details only real experts know']} as Record<Mode, [string, string]>,
    start: 'Start', loading: 'Loading…', error: 'Could not load. Please try again.', retry: 'Try again',
    soon: 'Questions for this mode are coming soon.',
    of: (i: number, n: number) => `Question ${i} of ${n}`,
    right: 'Correct!', wrong: (a: string) => `Not quite. The answer is: ${a}`,
    didYouKnow: 'Did you know?', where: '📍 Where to see it', next: 'Next', finish: 'See my result',
    result: 'Your result', time: (t: string) => `in ${t}`,
    titles: ['Registan Rookie', 'Chaikhana Guest', 'Bazaar Expert', 'Keeper of the Silk Road'],
    story: '📲 Share to story', challenge: '⚔️ Challenge a friend', download: '⬇️ Download image', again: '↻ Play again', other: 'Try the other mode',
    storyText: (s: number, t: string) => `I scored ${s}/10 — “${t}” 🇺🇿 How well do you know Uzbekistan? t.me/${BOT}`,
    storyLink: 'Take the quiz',
    shareText: (s: number, t: string) => `I scored ${s}/10 in “How well do you know Uzbekistan?” — ${t}. Can you beat it?`,
    hint: 'In Telegram you can post the result to your story and get into the leaderboard.', bot: 'Open in Telegram',
    top: '🏆 Leaderboard', topEmpty: 'No one here yet — be the first!', topNote: 'Top 10 by score; equal scores — the faster one wins. Only players who chose to be shown.',
    showMe: (n: string) => `Show me in the leaderboard as ${n}`, showNote: 'Your Telegram name will be visible to everyone. Untick to remove it.',
    rank: (n: number) => `You are #${n} in this mode`, saving: 'Saving…', saveError: 'Could not save. Try again.',
    webTop: 'To get into the leaderboard, play in Telegram.', expired: 'The round has expired. Start again.',
  },
  ru: {
    label: 'Викторина', title: 'Насколько ты знаешь Узбекистан?',
    lead: '10 вопросов о городах, истории, еде и традициях. После каждого ответа — короткая история и место, где это можно увидеть своими глазами.',
    modes: {tourist: ['🧳 Турист', 'Главные места и первые шаги'], local: ['🏡 Местный', 'Сложнее: детали, которые знают знатоки']} as Record<Mode, [string, string]>,
    start: 'Начать', loading: 'Загружаем…', error: 'Не удалось загрузить. Попробуйте ещё раз.', retry: 'Повторить',
    soon: 'Вопросы для этого режима скоро появятся.',
    of: (i: number, n: number) => `Вопрос ${i} из ${n}`,
    right: 'Верно!', wrong: (a: string) => `Не совсем. Правильный ответ: ${a}`,
    didYouKnow: 'А вы знали?', where: '📍 Где это посмотреть', next: 'Дальше', finish: 'Узнать результат',
    result: 'Ваш результат', time: (t: string) => `за ${t}`,
    titles: ['Новичок у Регистана', 'Гость чайханы', 'Знаток базара', 'Хранитель Шёлкового пути'],
    story: '📲 Выложить в сторис', challenge: '⚔️ Бросить вызов другу', download: '⬇️ Скачать картинку', again: '↻ Пройти ещё раз', other: 'Попробовать другой режим',
    storyText: (s: number, t: string) => `Мой результат — ${s}/10, «${t}» 🇺🇿 А ты насколько знаешь Узбекистан? t.me/${BOT}`,
    storyLink: 'Пройти викторину',
    shareText: (s: number, t: string) => `Я прошёл викторину «Насколько ты знаешь Узбекистан?» — ${s}/10, «${t}». Сможешь лучше?`,
    hint: 'В Telegram результат можно выложить в сторис и попасть в рейтинг.', bot: 'Открыть в Telegram',
    top: '🏆 Рейтинг', topEmpty: 'Здесь пока никого — станьте первым!', topNote: 'Топ-10 по баллам; при равных баллах выше тот, кто ответил быстрее. Только игроки, которые сами захотели здесь быть.',
    showMe: (n: string) => `Показать меня в рейтинге как ${n}`, showNote: 'Ваше имя из Telegram увидят все. Снимите галочку, чтобы убрать его.',
    rank: (n: number) => `Ваше место в этом режиме: ${n}`, saving: 'Сохраняем…', saveError: 'Не удалось сохранить. Попробуйте ещё раз.',
    webTop: 'Чтобы попасть в рейтинг, пройдите викторину в Telegram.', expired: 'Раунд устарел. Начните заново.',
  },
}

// Минимальное описание Telegram Mini App API, которое нам нужно (https://core.telegram.org/bots/webapps).
type TgWebApp = {
  initData: string
  initDataUnsafe: {user?: {is_premium?: boolean; username?: string; first_name?: string; last_name?: string}; start_param?: string}
  ready: () => void
  expand: () => void
  isVersionAtLeast: (v: string) => boolean
  openTelegramLink: (url: string) => void
  shareToStory?: (url: string, params?: {text?: string; widget_link?: {url: string; name?: string}}) => void
  shareMessage?: (id: string, cb?: (sent: boolean) => void) => void
  downloadFile?: (p: {url: string; file_name: string}, cb?: (ok: boolean) => void) => void
  HapticFeedback?: {notificationOccurred: (t: 'success' | 'error' | 'warning') => void}
}
const webApp = (): TgWebApp | null => {
  const w = (typeof window !== 'undefined' ? (window as unknown as {Telegram?: {WebApp?: TgWebApp}}).Telegram?.WebApp : undefined) || null
  return w && w.initData ? w : null
}

const tier = (s: number) => (s <= 3 ? 0 : s <= 6 ? 1 : s <= 8 ? 2 : 3)
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`
// Ник так же, как его покажет сервер: @username или имя и первая буква фамилии.
const nickPreview = (u?: TgWebApp['initDataUnsafe']['user']) =>
  u?.username ? `@${u.username}` : [u?.first_name, u?.last_name ? `${u.last_name[0]}.` : ''].filter(Boolean).join(' ') || 'Telegram'

async function api<T>(body: object): Promise<T> {
  const r = await fetch('/api/quiz', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
  const d = (await r.json().catch(() => ({}))) as T & {error?: string}
  if (!r.ok) throw new Error(d.error || String(r.status))
  return d
}

function Leaderboard({lang, info, mode: initial}: {lang: QuizLang; info: Info | null; mode: Mode}) {
  const tx = TX[lang]
  const [mode, setMode] = useState<Mode>(initial)
  useEffect(() => setMode(initial), [initial])
  const rows = info?.top?.[mode] || []
  return (
    <div className="quiz-top">
      <h3>{tx.top}</h3>
      <div className="pl-sort" role="group">
        {(['tourist', 'local'] as Mode[]).map((m) => (
          <button type="button" key={m} className={mode === m ? 'on' : ''} aria-pressed={mode === m} onClick={() => setMode(m)}>{tx.modes[m][0]}</button>
        ))}
      </div>
      {rows.length ? (
        <ol>
          {rows.map((r, k) => (
            <li key={k}><span className="quiz-top-n">{k < 3 ? ['🥇', '🥈', '🥉'][k] : k + 1}</span><b>{r.nick}</b><span>{r.score}/10 · {clock(r.sec)}</span></li>
          ))}
        </ol>
      ) : (
        <p className="muted">{tx.topEmpty}</p>
      )}
      <p className="muted quiz-small">{tx.topNote}</p>
    </div>
  )
}

export default function Quiz({lang}: {lang: QuizLang}) {
  const tx = TX[lang]
  const [info, setInfo] = useState<Info | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [mode, setMode] = useState<Mode>('tourist')
  const [shown, setShown] = useState<Shown | null>(null)
  const [checked, setChecked] = useState<Checked | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [final, setFinal] = useState<{score: number; ms: number; result: string} | null>(null)
  const [pub, setPub] = useState<{show: boolean; state: '' | 'saving' | 'error'; rank: number}>({show: false, state: '', rank: 0})
  const [tg, setTg] = useState<TgWebApp | null>(null)
  const src = useRef('site')
  const top = useRef<HTMLDivElement>(null)

  const track = useCallback((event: string, extra: Record<string, unknown> = {}) => {
    const body = JSON.stringify({event, lang, src: src.current, ...extra})
    try {
      if (!navigator.sendBeacon?.('/api/quiz', new Blob([body], {type: 'application/json'}))) throw 0
    } catch {
      fetch('/api/quiz', {method: 'POST', headers: {'Content-Type': 'application/json'}, body, keepalive: true}).catch(() => {})
    }
  }, [lang])

  const load = useCallback(() => {
    setState('loading')
    fetch('/api/quiz')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Info) => { setInfo(d); setState('ready') })
      .catch(() => setState('error'))
  }, [])

  useEffect(() => {
    load()
    const p = new URLSearchParams(location.search).get('src')
    if (p) src.current = p.slice(0, 30)
  }, [load])

  // Внутри Telegram: прячем шапку и подвал сайта, разворачиваем окно на весь экран.
  const onTelegram = useCallback(() => {
    const w = webApp()
    if (!w) return
    setTg(w)
    document.documentElement.classList.add('tg')
    w.ready()
    w.expand()
    if (src.current === 'site') src.current = w.initDataUnsafe.start_param?.slice(0, 30) || 'telegram'
  }, [])
  useEffect(() => {
    onTelegram()
    track('open')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollTop = () => top.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
  const fail = (e: unknown) => setErr(['expired', 'used', 'bad token', 'question gone'].includes((e as Error)?.message) ? tx.expired : tx.error)

  const start = async (m: Mode) => {
    setMode(m); setErr(''); setBusy(true)
    try {
      const s = await api<Shown>({action: 'start', mode: m, lang, initData: webApp()?.initData || ''})
      setShown(s); setChecked(null); setPicked(null); setFinal(null); setPub({show: false, state: '', rank: 0})
      track('start', {mode: m})
      scrollTop()
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }
  const answer = async (k: number) => {
    if (picked !== null || !shown || busy) return
    setPicked(k); setBusy(true); setErr('')
    try {
      const c = await api<Checked>({action: 'answer', token: shown.token, choice: k})
      setChecked(c)
      tg?.HapticFeedback?.notificationOccurred(c.ok ? 'success' : 'error')
    } catch (e) {
      setPicked(null)
      fail(e)
    } finally {
      setBusy(false)
    }
  }
  const next = async () => {
    if (!checked) return
    setErr('')
    if (checked.done && checked.result) {
      setFinal({score: checked.score || 0, ms: checked.ms || 0, result: checked.result})
      setShown(null)
      track('finish', {mode, score: checked.score})
      scrollTop()
      return
    }
    setBusy(true)
    try {
      const s = await api<Shown>({action: 'next', token: checked.token})
      setShown(s); setChecked(null); setPicked(null)
      scrollTop()
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }
  const reset = () => { setShown(null); setChecked(null); setFinal(null); setErr(''); load() }

  const openPlace = (id: string) => {
    track('place', {mode})
    if (tg) tg.openTelegramLink(botLink(id))
    else window.open(botLink(id), '_blank', 'noopener')
  }

  // ---------- итог: рейтинг и «поделиться» ----------
  const total = final?.score ?? 0
  const title = tx.titles[tier(total)]
  const img = `/quiz/story/${lang}-${mode}-${total}.jpg`

  const publish = async (show: boolean) => {
    if (!final || !tg) return
    setPub({show, state: 'saving', rank: 0})
    try {
      const d = await api<{rank: number}>({action: 'publish', result: final.result, initData: tg.initData, show})
      setPub({show, state: '', rank: show ? d.rank : 0})
      fetch('/api/quiz').then((r) => r.json()).then(setInfo).catch(() => {})
    } catch {
      setPub({show: !show, state: 'error', rank: 0})
    }
  }
  const toStory = () => {
    if (!tg?.shareToStory) return
    track('story', {mode, score: total})
    tg.shareToStory(SITE + img, {
      text: tx.storyText(total, title).slice(0, 200),
      ...(tg.initDataUnsafe.user?.is_premium ? {widget_link: {url: QUIZ_LINK, name: tx.storyLink}} : {}),
    })
  }
  const challenge = async () => {
    track('challenge', {mode, score: total})
    const text = tx.shareText(total, title)
    const url = `https://t.me/${BOT}?start=quiz_ch_${lang}`
    const tgShare = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    if (tg?.shareMessage && tg.isVersionAtLeast('8.0')) {
      setBusy(true)
      try {
        const r = await fetch('/api/quiz-share', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({initData: tg.initData, lang, mode, score: total})})
        const d = (await r.json()) as {id?: string}
        if (!d.id) throw new Error()
        tg.shareMessage(d.id)
      } catch {
        tg.openTelegramLink(tgShare)
      } finally {
        setBusy(false)
      }
      return
    }
    if (tg) return tg.openTelegramLink(tgShare)
    try {
      if (navigator.share) return await navigator.share({title: tx.title, text, url})
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return
    }
    window.open(tgShare, '_blank', 'noopener')
  }
  const download = () => {
    track('download', {mode, score: total})
    const name = `welcome2uz-quiz-${total}.jpg`
    if (tg?.downloadFile && tg.isVersionAtLeast('8.0')) return tg.downloadFile({url: SITE + img, file_name: name})
    const a = document.createElement('a')
    a.href = img
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const canStory = Boolean(tg?.shareToStory && tg.isVersionAtLeast('7.8'))
  const counts = info?.counts
  const errBox = err && <p className="quiz-err">{err} {err === tx.expired && <button type="button" className="btn ghost sm" onClick={reset}>{tx.again}</button>}</p>

  return (
    <div className="quiz" ref={top}>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onReady={onTelegram} />

      {!shown && !final && (
        <div className="quiz-intro">
          <p className="label">{tx.label}</p>
          <h1>{tx.title}</h1>
          <p className="muted quiz-lead">{tx.lead}</p>
          {state === 'loading' && <p className="muted">{tx.loading}</p>}
          {state === 'error' && <p className="muted">{tx.error} <button type="button" className="btn ghost sm" onClick={load}>{tx.retry}</button></p>}
          {state === 'ready' && counts && (
            <div className="quiz-modes">
              {(['tourist', 'local'] as Mode[]).map((m) => (
                <button type="button" key={m} className="quiz-mode" disabled={!counts[m]?.[lang] || busy} onClick={() => start(m)}>
                  <b>{tx.modes[m][0]}</b>
                  <span className="muted">{counts[m]?.[lang] ? tx.modes[m][1] : tx.soon}</span>
                  {counts[m]?.[lang] > 0 && <span className="quiz-go">{busy && mode === m ? tx.loading : `${tx.start} →`}</span>}
                </button>
              ))}
            </div>
          )}
          {errBox}
          {!tg && <p className="muted quiz-hint">{tx.hint} <a href={QUIZ_LINK} target="_blank" rel="noopener">{tx.bot} ✈</a></p>}
          {state === 'ready' && <Leaderboard lang={lang} info={info} mode={mode} />}
        </div>
      )}

      {shown && (
        <div className="quiz-card" key={shown.i}>
          <div className="quiz-progress" aria-hidden="true"><span style={{width: `${((shown.i + (checked ? 1 : 0)) / shown.total) * 100}%`}} /></div>
          <p className="label">{tx.modes[mode][0]} · {tx.of(shown.i + 1, shown.total)}</p>
          <h2 className="quiz-q">{shown.question.q}</h2>
          <div className="quiz-options">
            {shown.question.options.map((o, k) => {
              const cls = !checked ? (picked === k ? ' wait' : '') : k === checked.correct ? ' ok' : k === picked ? ' bad' : ' dim'
              return <button type="button" key={k} className={`quiz-opt${cls}`} disabled={picked !== null} onClick={() => answer(k)}>{o}</button>
            })}
          </div>
          {errBox}
          {checked && (
            <div className="quiz-explain" role="status">
              <p className={checked.ok ? 'quiz-ok' : 'quiz-bad'}><b>{checked.ok ? tx.right : tx.wrong(shown.question.options[checked.correct])}</b></p>
              {checked.explain && <><p className="label" style={{marginTop: 12}}>{tx.didYouKnow}</p><p>{checked.explain}</p></>}
              <div className="quiz-actions">
                {checked.place && <button type="button" className="btn ghost" onClick={() => openPlace(checked.place)}>{tx.where}</button>}
                <button type="button" className="btn" onClick={next} disabled={busy}>{busy ? tx.loading : `${checked.done ? tx.finish : tx.next} →`}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {final && (
        <>
          <div className="quiz-result">
            <div>
              <p className="label">{tx.result} · {tx.modes[mode][0]}</p>
              <p className="quiz-score">{total}<small>/10</small></p>
              <h2>{title}</h2>
              <p className="muted">{tx.time(clock(final.ms / 1000))}</p>
              {tg ? (
                <div className="quiz-pub">
                  <label>
                    <input type="checkbox" checked={pub.show} disabled={pub.state === 'saving'} onChange={(e) => publish(e.target.checked)} />
                    <span>{tx.showMe(nickPreview(tg.initDataUnsafe.user))}</span>
                  </label>
                  <p className="muted quiz-small">{pub.state === 'saving' ? tx.saving : pub.state === 'error' ? tx.saveError : pub.rank ? tx.rank(pub.rank) : tx.showNote}</p>
                </div>
              ) : (
                <p className="muted quiz-small">{tx.webTop} <a href={QUIZ_LINK} target="_blank" rel="noopener">{tx.bot} ✈</a></p>
              )}
              <div className="quiz-share">
                {canStory && <button type="button" className="btn" onClick={toStory}>{tx.story}</button>}
                <button type="button" className={`btn${canStory ? ' ghost' : ''}`} onClick={challenge} disabled={busy}>{tx.challenge}</button>
                <button type="button" className="btn ghost" onClick={download}>{tx.download}</button>
              </div>
              <div className="quiz-share" style={{marginTop: 10}}>
                <button type="button" className="btn ghost sm" onClick={() => start(mode)} disabled={busy}>{tx.again}</button>
                <button type="button" className="btn ghost sm" onClick={() => start(mode === 'tourist' ? 'local' : 'tourist')} disabled={busy}>{tx.other}</button>
              </div>
              {errBox}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="quiz-story" src={img} alt={`${total}/10 · ${title}`} width={1080} height={1920} />
          </div>
          <Leaderboard lang={lang} info={info} mode={mode} />
        </>
      )}
    </div>
  )
}
