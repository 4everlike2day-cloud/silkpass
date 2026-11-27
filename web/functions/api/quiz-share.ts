// Cloudflare Pages Function: POST /api/quiz-share
// Кнопка «Бросить вызов другу» в викторине (Telegram Mini App).
// Готовит сообщение от бота @w2uz_bot (картинка с результатом + кнопка «Пройти викторину»)
// через savePreparedInlineMessage. Mini App потом открывает окно выбора чата: Telegram.WebApp.shareMessage(id).
// Запрос подписан Telegram (initData), поэтому подготовить сообщение можно только для себя.
//
// Тело запроса: {initData, lang: 'ru'|'en', mode: 'tourist'|'local', score: 0..10}
// Переменные окружения: PLACES_BOT_TOKEN (токен @w2uz_bot).

type Env = {PLACES_BOT_TOKEN?: string}

const SITE = 'https://welcome2.uz'
const BOT = 'w2uz_bot'
const MAX_AGE = 24 * 3600 // initData старше суток не принимаем

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}})

const TITLES = {
  ru: ['Новичок у Регистана', 'Гость чайханы', 'Знаток базара', 'Хранитель Шёлкового пути'],
  en: ['Registan Rookie', 'Chaikhana Guest', 'Bazaar Expert', 'Keeper of the Silk Road'],
}
const tier = (s: number) => (s <= 3 ? 0 : s <= 6 ? 1 : s <= 8 ? 2 : 3)
const TEXT = {
  ru: {
    caption: (s: number, t: string) => `🇺🇿 Я прошёл викторину «Насколько ты знаешь Узбекистан?»\nМой результат — ${s}/10, «${t}».\n\nСможешь лучше? 😉`,
    button: '🎯 Пройти викторину',
  },
  en: {
    caption: (s: number, t: string) => `🇺🇿 I took the “How well do you know Uzbekistan?” quiz\nMy score: ${s}/10, “${t}”.\n\nCan you beat it? 😉`,
    button: '🎯 Take the quiz',
  },
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
async function hmac(key: BufferSource, data: string) {
  const k = await crypto.subtle.importKey('raw', key, {name: 'HMAC', hash: 'SHA-256'}, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data))
}

// Проверка подписи Telegram: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
async function userFrom(initData: string, token: string): Promise<number | null> {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash') || ''
  params.delete('hash')
  const check = [...params.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join('\n')
  const secret = await hmac(new TextEncoder().encode('WebAppData'), token)
  if (!hash || hex(await hmac(secret, check)) !== hash) return null
  if (Date.now() / 1000 - Number(params.get('auth_date') || 0) > MAX_AGE) return null
  try {
    const id = Number((JSON.parse(params.get('user') || '{}') as {id?: number}).id)
    return id > 0 ? id : null
  } catch {
    return null
  }
}

export const onRequestPost = async ({request, env}: {request: Request; env: Env}) => {
  if (!env.PLACES_BOT_TOKEN) return json({error: 'not configured'}, 500)
  let d: {initData?: string; lang?: string; mode?: string; score?: number}
  try {
    d = await request.json()
  } catch {
    return json({error: 'bad json'}, 400)
  }
  const user = await userFrom(String(d.initData || ''), env.PLACES_BOT_TOKEN)
  if (!user) return json({error: 'forbidden'}, 403)
  const lang = d.lang === 'en' ? 'en' : 'ru'
  const mode = d.mode === 'local' ? 'local' : 'tourist'
  const score = Math.max(0, Math.min(10, Math.round(Number(d.score) || 0)))
  const photo = `${SITE}/quiz/story/${lang}-${mode}-${score}.jpg`
  const tx = TEXT[lang]

  const res = await fetch(`https://api.telegram.org/bot${env.PLACES_BOT_TOKEN}/savePreparedInlineMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      user_id: user,
      result: {
        type: 'photo',
        id: `quiz-${lang}-${mode}-${score}`,
        photo_url: photo,
        thumbnail_url: photo,
        caption: tx.caption(score, TITLES[lang][tier(score)]),
        reply_markup: {inline_keyboard: [[{text: tx.button, url: `https://t.me/${BOT}?start=quiz_ch_${lang}`}]]},
      },
      allow_user_chats: true,
      allow_group_chats: true,
      allow_channel_chats: true,
    }),
  })
  const data = (await res.json().catch(() => ({}))) as {ok?: boolean; result?: {id?: string}; description?: string}
  if (!data.ok || !data.result?.id) return json({error: data.description || 'telegram error'}, 502)
  return json({id: data.result.id})
}
