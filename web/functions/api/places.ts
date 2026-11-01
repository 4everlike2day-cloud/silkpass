// Cloudflare Pages Function: /api/places
// GET  /api/places?city=tashkent  — опубликованные места города для сайта (кэш 10 минут).
// POST /api/places                — форма «Предложить место»: строка на лист «Предложения» и уведомление в Telegram.
// Данные — из Google-таблицы «Узбекистан: что посмотреть» через веб-приложение Apps Script (tools/places-apps-script.js).
//
// Переменные окружения (те же, что у бота @w2uz_bot, плюс уведомления):
//   PLACES_SCRIPT_URL  адрес веб-приложения Apps Script (…/exec)
//   PLACES_SECRET      пароль скрипта (для записи предложений)
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  куда прислать уведомление о новом предложении (бот заказов)

type Env = {PLACES_SCRIPT_URL?: string; PLACES_SECRET?: string; TELEGRAM_BOT_TOKEN?: string; TELEGRAM_CHAT_ID?: string}
type Place = {id: string; city?: string; name: string; description: string; category: string; link: string; location: string; photo?: string; likes: number; dislikes: number}

const CITY: Record<string, string> = {tashkent: 'Ташкент', samarkand: 'Самарканд', bukhara: 'Бухара', khiva: 'Хива'}
const TTL = 600
const json = (data: unknown, status = 200, cache = 0) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store', 'Access-Control-Allow-Origin': '*'},
  })
const esc = (v: unknown) => String(v ?? '').slice(0, 1000).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)

async function loadAll(env: Env): Promise<Place[]> {
  const res = await fetch(`${env.PLACES_SCRIPT_URL}?action=places`, {redirect: 'follow'})
  const data = (await res.json()) as {places?: Place[]}
  if (!Array.isArray(data.places)) throw new Error('bad data')
  return data.places
}

export const onRequestGet = async ({request, env}: {request: Request; env: Env}) => {
  if (!env.PLACES_SCRIPT_URL) return json({error: 'not configured'}, 500)
  const url = new URL(request.url)
  const slug = url.searchParams.get('city') || ''
  const city = CITY[slug]
  if (!city) return json({error: 'unknown city'}, 400)

  const cache = (caches as unknown as {default: Cache}).default
  const key = new Request(`${url.origin}/api/places?city=${slug}`)
  try {
    const hit = await cache.match(key)
    if (hit) return hit
  } catch {
    // без кэша
  }
  let places: Place[]
  try {
    places = (await loadAll(env)).filter((p) => (p.city || 'Ташкент') === city)
  } catch {
    return json({error: 'sheet unavailable'}, 502)
  }
  const out = places.map(({id, name, description, category, link, location, photo, likes, dislikes}) => ({
    id, city, name, description, category, link, location, photo: photo || '', likes: Number(likes) || 0, dislikes: Number(dislikes) || 0,
  }))
  const res = json({city: slug, updated: new Date().toISOString(), places: out}, 200, TTL)
  try {
    await cache.put(key, res.clone())
  } catch {
    // без кэша
  }
  return res
}

export const onRequestPost = async ({request, env}: {request: Request; env: Env}) => {
  let d: Record<string, unknown>
  try {
    d = await request.json()
  } catch {
    return json({error: 'bad json'}, 400)
  }
  if (clip(d.website, 10)) return json({ok: true}) // ловушка для ботов
  const row = {
    city: clip(d.city, 40), name: clip(d.name, 120), description: clip(d.description, 1000), category: clip(d.category, 80),
    link: clip(d.link, 300), location: clip(d.location, 300), contact: clip(d.contact, 120), note: `Сайт, язык ${clip(d.lang, 5) || 'en'}`,
  }
  if (!row.name || row.name.length < 2) return json({error: 'name required'}, 400)

  let saved = false
  if (env.PLACES_SCRIPT_URL && env.PLACES_SECRET) {
    try {
      const r = await fetch(env.PLACES_SCRIPT_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({secret: env.PLACES_SECRET, action: 'suggest', ...row}),
        redirect: 'follow',
      })
      saved = Boolean(((await r.json()) as {ok?: boolean}).ok)
    } catch {
      saved = false
    }
  }

  let notified = false
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const lines = [
      '📍 <b>Предложили место</b>',
      `<b>${esc(row.name)}</b> · ${esc(row.city || 'город не указан')}`,
      row.category ? `Категория: ${esc(row.category)}` : '',
      row.description ? esc(row.description) : '',
      row.link ? `Ссылка: ${esc(row.link)}` : '',
      row.location ? `Карта: ${esc(row.location)}` : '',
      row.contact ? `Контакт: ${esc(row.contact)}` : '',
    ].filter(Boolean)
    const text = [...lines, '', saved ? '✅ Записано на лист «Предложения»' : '⚠️ В таблицу не записалось, добавьте вручную'].join('\n')
    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', link_preview_options: {is_disabled: true}}),
    }).catch(() => null)
    notified = Boolean(tg && tg.ok)
  }
  // Предложение не потеряно, если оно попало хотя бы в таблицу или в Telegram.
  return saved || notified ? json({ok: true}) : json({error: 'not saved'}, 502)
}
