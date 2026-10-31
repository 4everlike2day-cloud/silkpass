// Cloudflare Pages Function: POST /api/places-bot
// Вебхук Telegram-бота @w2uz_bot «Ташкент: что посмотреть».
// Бот показывает места из таблицы по категориям, под каждым местом кнопки 👍 / 👎.
// Голоса пишутся в таблицу через веб-приложение Apps Script (tools/places-apps-script.js):
// один голос на аккаунт Telegram, повторное нажатие той же кнопки снимает голос.
//
// Переменные окружения в Cloudflare Pages (Settings → Environment variables):
//   PLACES_BOT_TOKEN       токен @w2uz_bot от BotFather
//   PLACES_SCRIPT_URL      адрес веб-приложения Apps Script таблицы мест (…/exec)
//   PLACES_SECRET          пароль, тот же, что SECRET в свойствах скрипта
//   PLACES_WEBHOOK_SECRET  любой пароль из латиницы и цифр; тот же передаётся в setWebhook как secret_token

type Env = {PLACES_BOT_TOKEN?: string; PLACES_SCRIPT_URL?: string; PLACES_SECRET?: string; PLACES_WEBHOOK_SECRET?: string}
type Place = {id: string; name: string; description: string; category: string; link: string; location: string; likes: number; dislikes: number}
type Data = {categories: string[]; places: Place[]}
type TgUser = {id: number}
type Update = {
  message?: {chat: {id: number; type: string}; text?: string; from?: TgUser}
  callback_query?: {id: string; data?: string; from: TgUser; message?: {chat: {id: number}; message_id: number}}
}

const PAGE = 5
const SITE = 'https://welcome2.uz/tashkent'
const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v.trim())

async function tg(env: Env, method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${env.PLACES_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  })
  return res.json().catch(() => ({}))
}

// Список мест кэшируется на минуту, чтобы бот не дёргал таблицу на каждое нажатие.
async function load(env: Env, fresh = false): Promise<Data> {
  const cache = (caches as unknown as {default: Cache}).default
  const key = new Request('https://cache.w2uz/places-bot')
  if (!fresh) {
    const hit = await cache.match(key)
    if (hit) return hit.json()
  }
  const url = `${env.PLACES_SCRIPT_URL}?action=places&all=1&secret=${encodeURIComponent(env.PLACES_SECRET || '')}`
  const res = await fetch(url, {redirect: 'follow'})
  const data = (await res.json()) as Data
  if (!Array.isArray(data.places)) throw new Error('bad data')
  await cache.put(key, new Response(JSON.stringify(data), {headers: {'Cache-Control': 'max-age=60', 'Content-Type': 'application/json'}}))
  return data
}

async function uidOf(env: Env, user: TgUser) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${user.id}:${env.PLACES_SECRET}`))
  return [...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const voteKeyboard = (p: {id: string; likes: number; dislikes: number}) => ({
  inline_keyboard: [[
    {text: `👍 ${p.likes}`, callback_data: `v:${p.id}:1`},
    {text: `👎 ${p.dislikes}`, callback_data: `v:${p.id}:-1`},
  ]],
})

function placeText(p: Place) {
  const links = [isUrl(p.link) ? `<a href="${esc(p.link)}">Ссылка</a>` : '', isUrl(p.location) ? `<a href="${esc(p.location)}">На карте</a>` : '']
    .filter(Boolean).join(' · ')
  return [`<b>${esc(p.name)}</b>`, esc(p.description), links].filter(Boolean).join('\n')
}

async function menu(env: Env, chat: number, data: Data) {
  const used = data.categories.filter((c) => data.places.some((p) => p.category === c))
  const buttons = used.map((c) => ({text: `${c} (${data.places.filter((p) => p.category === c).length})`, callback_data: `c:${data.categories.indexOf(c)}:0`}))
  const rows: unknown[][] = []
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2))
  await tg(env, 'sendMessage', {
    chat_id: chat,
    parse_mode: 'HTML',
    text: '<b>Ташкент: что посмотреть</b>\nВыберите категорию. Под каждым местом ставьте 👍 или 👎: из голосов складывается рейтинг на сайте.',
    reply_markup: {inline_keyboard: rows},
  })
}

async function category(env: Env, chat: number, data: Data, idx: number, offset: number) {
  const name = data.categories[idx]
  const list = data.places.filter((p) => p.category === name)
  const page = list.slice(offset, offset + PAGE)
  if (!page.length) return menu(env, chat, data)
  if (offset === 0) await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: `<b>${esc(name)}</b>`})
  for (const p of page) {
    await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: placeText(p), link_preview_options: {is_disabled: true}, reply_markup: voteKeyboard(p)})
  }
  const nav: unknown[] = []
  const left = list.length - offset - page.length
  if (left > 0) nav.push({text: `Ещё ${left}`, callback_data: `c:${idx}:${offset + PAGE}`})
  nav.push({text: '← Категории', callback_data: 'm'})
  await tg(env, 'sendMessage', {chat_id: chat, text: left > 0 ? `Показано ${offset + page.length} из ${list.length}` : 'Это все места в категории.', reply_markup: {inline_keyboard: [nav]}})
}

async function vote(env: Env, cb: NonNullable<Update['callback_query']>, place: string, v: number) {
  const res = await fetch(env.PLACES_SCRIPT_URL!, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({secret: env.PLACES_SECRET, action: 'vote', place, uid: await uidOf(env, cb.from), v, toggle: true}),
    redirect: 'follow',
  })
  const r = (await res.json().catch(() => ({}))) as {likes?: number; dislikes?: number; v?: number; error?: string}
  if (r.error || r.likes === undefined) {
    await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id, text: 'Не получилось сохранить голос, попробуйте ещё раз'})
    return
  }
  await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id, text: r.v === 0 ? 'Голос снят' : r.v === 1 ? 'Спасибо! 👍 учтён' : 'Спасибо! 👎 учтён'})
  if (cb.message) {
    await tg(env, 'editMessageReplyMarkup', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      reply_markup: voteKeyboard({id: place, likes: r.likes, dislikes: r.dislikes ?? 0}),
    })
  }
}

export const onRequestPost = async ({request, env}: {request: Request; env: Env}) => {
  if (!env.PLACES_BOT_TOKEN || !env.PLACES_SCRIPT_URL || !env.PLACES_SECRET) return new Response('Not configured', {status: 500})
  if (env.PLACES_WEBHOOK_SECRET && request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.PLACES_WEBHOOK_SECRET) {
    return new Response('Forbidden', {status: 403})
  }
  let u: Update
  try {
    u = await request.json()
  } catch {
    return new Response('ok')
  }

  try {
    if (u.message && u.message.chat.type === 'private') {
      const text = (u.message.text || '').trim()
      if (text.startsWith('/site')) {
        await tg(env, 'sendMessage', {chat_id: u.message.chat.id, text: `Все места и рейтинг: ${SITE}`})
      } else {
        await menu(env, u.message.chat.id, await load(env))
      }
    } else if (u.callback_query) {
      const cb = u.callback_query
      const [kind, a, b] = (cb.data || '').split(':')
      const chat = cb.message?.chat.id
      if (kind === 'v') {
        await vote(env, cb, a, Number(b))
      } else if (chat) {
        await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id})
        const data = await load(env)
        if (kind === 'c') await category(env, chat, data, Number(a), Number(b) || 0)
        else await menu(env, chat, data)
      }
    }
  } catch {
    // Telegram повторяет вебхук при ошибке; отвечаем 200, чтобы не получить лавину повторов.
  }
  return new Response('ok')
}
