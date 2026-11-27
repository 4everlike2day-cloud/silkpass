// Cloudflare Pages Function: /api/quiz — викторина «Насколько ты знаешь Узбекистан?».
//
// Правильные ответы никогда не уходят в браузер: вопросы выдаются по одному, ответ проверяет сервер,
// он же считает время. Ход игры хранится в подписанном «билете» (token): подделать счёт или время нельзя,
// а повторно отправить один и тот же билет (переиграть ответ) мешает отметка «билет использован».
//
// GET  /api/quiz                                   число вопросов по режимам и топ-10 рейтинга (кэш 1 минута)
// POST {action:'start', mode, lang, initData?}     новый раунд: первый вопрос и билет
// POST {action:'answer', token, choice}            проверка ответа: правильный вариант, пояснение, ID места
// POST {action:'next', token}                      следующий вопрос (время пошло)
// POST {action:'publish', result, initData, show}  попасть в рейтинг (show:true) или убрать себя (show:false). Только Telegram.
// POST {event, mode, lang, score, src}             событие для статистики (без личных данных)
//
// Данные — лист «Викторина» таблицы мест через Apps Script (tools/places-apps-script.js).
// Переменные окружения: PLACES_SCRIPT_URL, PLACES_SECRET, PLACES_BOT_TOKEN (для проверки подписи Telegram).

type Env = {PLACES_SCRIPT_URL?: string; PLACES_SECRET?: string; PLACES_BOT_TOKEN?: string}
type Lang = 'ru' | 'en'
type Mode = 'tourist' | 'local'
type Tr = {q: string; options: string[]; explain: string}
type Question = {id: string; mode: Mode; correct: number; place: string; tr: Partial<Record<Lang | 'uz', Tr>>}
// Билет раунда: u — Telegram ID (0 на сайте), q — ID вопросов, i — номер текущего, s — правильных,
// ms — время на ответы, ts — когда показан текущий вопрос (0 — ещё не показан), o — порядок вариантов, n — случайная метка.
type Round = {k: 'round'; u: number; m: Mode; l: Lang; q: string[]; i: number; s: number; ms: number; ts: number; o: number[]; n: string}
type Result = {k: 'result'; u: number; m: Mode; score: number; ms: number; t: number}

const ROUND = 10
const MAX_QUESTION_MS = 120_000 // дольше двух минут на вопрос не считаем
const ROUND_TTL = 6 * 3600_000 // билет раунда живёт 6 часов
const RESULT_TTL = 24 * 3600_000
const INIT_TTL = 24 * 3600 // initData от Telegram — сутки
const EVENTS = ['open', 'start', 'finish', 'story', 'challenge', 'download', 'place']

const json = (data: unknown, status = 200, cache = 0) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store'},
  })
const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)
const cacheStore = () => {
  try {
    return (caches as unknown as {default: Cache}).default
  } catch {
    return null
  }
}

// ---------- подпись ----------
const enc = new TextEncoder()
const b64u = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
async function hmac(key: BufferSource, data: string) {
  const k = await crypto.subtle.importKey('raw', key, {name: 'HMAC', hash: 'SHA-256'}, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, enc.encode(data))
}
async function sign(env: Env, data: object) {
  const body = b64u(enc.encode(JSON.stringify(data)))
  return `${body}.${b64u(await hmac(enc.encode(`quiz:${env.PLACES_SECRET}`), body))}`
}
async function unsign<T>(env: Env, token: unknown): Promise<T | null> {
  const [body, sig] = String(token || '').split('.')
  if (!body || !sig || b64u(await hmac(enc.encode(`quiz:${env.PLACES_SECRET}`), body)) !== sig) return null
  try {
    return JSON.parse(new TextDecoder().decode(unb64u(body))) as T
  } catch {
    return null
  }
}
// Один билет — один ход. Отметка хранится в кэше Cloudflare.
async function useOnce(token: string) {
  const c = cacheStore()
  if (!c) return true
  const key = new Request(`https://welcome2.uz/__quiz/used/${token.split('.')[1]}`)
  if (await c.match(key)) return false
  await c.put(key, new Response('1', {headers: {'Cache-Control': 'max-age=21600'}}))
  return true
}

// ---------- Telegram ----------
type TgUser = {id: number; username?: string; first_name?: string; last_name?: string}
async function tgUser(env: Env, initData: unknown): Promise<TgUser | null> {
  if (!env.PLACES_BOT_TOKEN || !initData) return null
  const params = new URLSearchParams(String(initData))
  const hash = params.get('hash') || ''
  params.delete('hash')
  const check = [...params.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join('\n')
  const secret = await hmac(enc.encode('WebAppData'), env.PLACES_BOT_TOKEN)
  const mine = [...new Uint8Array(await hmac(secret, check))].map((b) => b.toString(16).padStart(2, '0')).join('')
  if (!hash || mine !== hash) return null
  if (Date.now() / 1000 - Number(params.get('auth_date') || 0) > INIT_TTL) return null
  try {
    const u = JSON.parse(params.get('user') || '{}') as TgUser
    return u.id > 0 ? u : null
  } catch {
    return null
  }
}
// Ник для рейтинга: @username, а если его нет — имя и первая буква фамилии.
const nickOf = (u: TgUser) =>
  u.username ? `@${u.username}` : clip([u.first_name, u.last_name ? `${u.last_name[0]}.` : ''].filter(Boolean).join(' '), 32) || 'Telegram'
// Игрок в таблице — под шифром, как голоса в боте.
async function uidOf(env: Env, id: number) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(`${id}:${env.PLACES_SECRET}`))
  return [...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')
}

// ---------- данные ----------
async function questions(env: Env, origin: string): Promise<Question[]> {
  const c = cacheStore()
  const key = new Request(`${origin}/__quiz/questions`)
  const hit = c && (await c.match(key).catch(() => undefined))
  if (hit) return hit.json()
  const res = await fetch(`${env.PLACES_SCRIPT_URL}?action=quiz&secret=${encodeURIComponent(env.PLACES_SECRET || '')}`, {redirect: 'follow'})
  const data = (await res.json()) as {questions?: Question[]}
  if (!Array.isArray(data.questions)) throw new Error('bad data')
  await c?.put(key, new Response(JSON.stringify(data.questions), {headers: {'Cache-Control': 'max-age=600'}})).catch(() => {})
  return data.questions
}
async function top(env: Env) {
  try {
    const res = await fetch(`${env.PLACES_SCRIPT_URL}?action=quiztop`, {redirect: 'follow'})
    return (await res.json()) as Record<Mode, {nick: string; score: number; sec: number}[]>
  } catch {
    return {tourist: [], local: []}
  }
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1)
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
const final = (s: number, n: number) => (n ? Math.round((s * ROUND) / n) : 0)

// Вопрос для показа: варианты в случайном порядке, без правильного ответа.
async function show(env: Env, all: Question[], r: Round) {
  const q = all.find((x) => x.id === r.q[r.i])
  const tr = q?.tr[r.l]
  if (!q || !tr) return null
  const next: Round = {...r, ts: Date.now(), o: shuffle(tr.options.map((_, k) => k))}
  return {token: await sign(env, next), i: r.i, total: r.q.length, question: {q: tr.q, options: next.o.map((k) => tr.options[k])}}
}

// ---------- обработчики ----------
export const onRequestGet = async ({request, env}: {request: Request; env: Env}) => {
  if (!env.PLACES_SCRIPT_URL || !env.PLACES_SECRET) return json({error: 'not configured'}, 500)
  const origin = new URL(request.url).origin
  const c = cacheStore()
  const key = new Request(`${origin}/api/quiz`)
  const hit = c && (await c.match(key).catch(() => undefined))
  if (hit) return hit
  let all: Question[]
  try {
    all = await questions(env, origin)
  } catch {
    return json({error: 'sheet unavailable'}, 502)
  }
  const counts = {tourist: {ru: 0, en: 0}, local: {ru: 0, en: 0}}
  all.forEach((q) => (['ru', 'en'] as Lang[]).forEach((l) => q.tr[l] && counts[q.mode] && counts[q.mode][l]++))
  const res = json({counts, top: await top(env)}, 200, 60)
  await c?.put(key, res.clone()).catch(() => {})
  return res
}

export const onRequestPost = async ({request, env, waitUntil}: {request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void}) => {
  if (!env.PLACES_SCRIPT_URL || !env.PLACES_SECRET) return json({error: 'not configured'}, 500)
  let d: Record<string, unknown>
  try {
    d = await request.json()
  } catch {
    return json({error: 'bad json'}, 400)
  }
  const origin = new URL(request.url).origin
  const script = (body: object) =>
    fetch(env.PLACES_SCRIPT_URL!, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({secret: env.PLACES_SECRET, ...body}), redirect: 'follow'})

  // Статистика: запись в таблицу в фоне, ответ человеку не ждёт Google.
  if (d.event) {
    const event = clip(d.event, 20)
    if (!EVENTS.includes(event)) return json({error: 'bad event'}, 400)
    waitUntil(script({action: 'quizstat', event, mode: clip(d.mode, 10), lang: clip(d.lang, 5), score: d.score == null ? '' : clip(d.score, 3), src: clip(d.src, 30)}).catch(() => {}))
    return json({ok: true})
  }

  try {
    if (d.action === 'start') {
      const mode: Mode = d.mode === 'local' ? 'local' : 'tourist'
      const lang: Lang = d.lang === 'en' ? 'en' : 'ru'
      const all = await questions(env, origin)
      const pool = shuffle(all.filter((q) => q.mode === mode && q.tr[lang])).slice(0, ROUND)
      if (!pool.length) return json({error: 'no questions'}, 404)
      const user = await tgUser(env, d.initData)
      const r: Round = {k: 'round', u: user?.id || 0, m: mode, l: lang, q: pool.map((q) => q.id), i: 0, s: 0, ms: 0, ts: 0, o: [], n: b64u(crypto.getRandomValues(new Uint8Array(9)))}
      return json(await show(env, all, r))
    }

    if (d.action === 'answer' || d.action === 'next') {
      const token = String(d.token || '')
      const r = await unsign<Round>(env, token)
      if (!r || r.k !== 'round' || r.i >= r.q.length) return json({error: 'bad token'}, 400)
      if (d.action === 'answer' ? !r.ts : r.ts) return json({error: 'bad step'}, 400)
      if (Date.now() - (r.ts || Date.now()) > ROUND_TTL) return json({error: 'expired'}, 410)
      const all = await questions(env, origin)
      if (!(await useOnce(token))) return json({error: 'used'}, 409)

      if (d.action === 'next') {
        const out = await show(env, all, r)
        return out ? json(out) : json({error: 'question gone'}, 410)
      }

      const q = all.find((x) => x.id === r.q[r.i])
      const tr = q?.tr[r.l]
      if (!q || !tr) return json({error: 'question gone'}, 410)
      const correct = r.o.indexOf(q.correct)
      const ok = Number(d.choice) === correct
      const after: Round = {...r, i: r.i + 1, s: r.s + (ok ? 1 : 0), ms: r.ms + Math.min(Math.max(Date.now() - r.ts, 0), MAX_QUESTION_MS), ts: 0, o: []}
      const done = after.i >= after.q.length
      const out: Record<string, unknown> = {correct, ok, explain: tr.explain, place: q.place, done}
      if (done) {
        const score = final(after.s, after.q.length)
        out.score = score
        out.ms = after.ms
        out.result = await sign(env, {k: 'result', u: r.u, m: r.m, score, ms: after.ms, t: Date.now()} satisfies Result)
      } else {
        out.token = await sign(env, after)
      }
      return json(out)
    }

    if (d.action === 'publish') {
      const res = await unsign<Result>(env, d.result)
      if (!res || res.k !== 'result' || Date.now() - res.t > RESULT_TTL) return json({error: 'bad result'}, 400)
      const user = await tgUser(env, d.initData)
      if (!user || (res.u && res.u !== user.id)) return json({error: 'forbidden'}, 403)
      const r = await script({action: 'quizscore', uid: await uidOf(env, user.id), nick: nickOf(user), mode: res.m, score: res.score, ms: res.ms, show: Boolean(d.show)})
      const data = (await r.json()) as {ok?: boolean; rank?: number; best?: {score: number; sec: number}}
      // свежий рейтинг для всех: сбрасываем кэш GET /api/quiz
      await cacheStore()?.delete(new Request(`${origin}/api/quiz`)).catch(() => {})
      return data.ok ? json({ok: true, rank: data.rank || 0, best: data.best || null, nick: nickOf(user)}) : json({error: 'not saved'}, 502)
    }
  } catch {
    return json({error: 'sheet unavailable'}, 502)
  }
  return json({error: 'unknown action'}, 400)
}
