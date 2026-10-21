// Cloudflare Pages Function: POST /api/route-complete
// Форма «Маршрут пройден» со страницы /reward: номер паспорта, фото страницы 17, контакт, ссылка на пост.
// 1. Записывает заявку в реестр паспортов (Google Sheets через веб-приложение Apps Script).
// 2. Отправляет фото и данные в Telegram.
// Переменные окружения в Cloudflare Pages (Settings → Environment variables):
//   TELEGRAM_BOT_TOKEN  токен бота (тот же, что для заказов)
//   TELEGRAM_CHAT_ID    чат, куда приходят заявки
//   REGISTRY_URL        адрес веб-приложения Apps Script реестра (если не задан, работает только Telegram)
//   REGISTRY_SECRET     общий секрет, тот же, что в скрипте реестра

type Env = {TELEGRAM_BOT_TOKEN?: string; TELEGRAM_CHAT_ID?: string; REGISTRY_URL?: string; REGISTRY_SECRET?: string}
type Status = 'new' | 'updated' | 'claimed' | 'mail' | 'unknown'

const MAX_PHOTO = 8 * 1024 * 1024
const esc = (v: unknown) => String(v ?? '').slice(0, 500).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const field = (f: FormData, k: string, max = 300) => String(f.get(k) ?? '').trim().slice(0, max)

// Номер приводим к одному виду: заглавные буквы, пробелы заменяются дефисом. «w2-uz 0012» → «W2-UZ-0012».
// Реестр сравнивает номера только по буквам и цифрам, так что «W2UZ0012» и «W2-UZ-0012» считаются одним номером.
const normPassport = (v: string) => v.trim().toUpperCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-')

const STATUS_TEXT: Record<Status, string> = {
  new: '🆕 Новый номер, добавлен в реестр',
  updated: '✏️ Номер уже был в реестре, заявка дописана',
  claimed: '⛔ Промокод по этому номеру уже выдан',
  mail: '⛔ Печати по почте, без подарка',
  unknown: '⚠️ Реестр не ответил, проверьте вручную',
}

async function registry(env: Env, row: Record<string, string>): Promise<Status> {
  if (!env.REGISTRY_URL) return 'unknown'
  try {
    const res = await fetch(env.REGISTRY_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({secret: env.REGISTRY_SECRET || '', ...row}),
      redirect: 'follow',
    })
    const data = (await res.json()) as {status?: Status}
    return data.status && data.status in STATUS_TEXT ? data.status : 'unknown'
  } catch {
    return 'unknown'
  }
}

export const onRequestPost = async ({request, env}: {request: Request; env: Env}) => {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return new Response('Bad form', {status: 400})
  }
  if (field(form, 'website')) return Response.json({ok: true, status: 'new'}) // ловушка для ботов

  const passport = normPassport(field(form, 'passport', 40))
  const contact = field(form, 'contact', 120)
  const post = field(form, 'post', 300)
  const lang = field(form, 'lang', 5) || 'en'
  const photo = form.get('photo')
  if (!passport || passport.length < 3 || !contact) return new Response('Missing fields', {status: 400})
  if (!(photo instanceof File) || !photo.type.startsWith('image/') || photo.size > MAX_PHOTO) return new Response('Bad photo', {status: 400})
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return new Response('Telegram is not configured', {status: 500})

  const status = await registry(env, {passport, contact, post, lang})

  // Повторная заявка по номеру, где промокод уже выдан: в Telegram всё равно сообщаем, турист получает отказ.
  const caption = [
    '🏁 <b>Маршрут пройден</b>',
    `<b>Паспорт:</b> ${esc(passport)}`,
    `<b>Контакт:</b> ${esc(contact)}`,
    post ? `<b>Пост:</b> ${esc(post)}` : '<b>Пост:</b> нет',
    `<b>Язык сайта:</b> ${esc(lang.toUpperCase())}`,
    '',
    STATUS_TEXT[status],
  ].join('\n')

  const tgForm = new FormData()
  tgForm.set('chat_id', env.TELEGRAM_CHAT_ID)
  tgForm.set('caption', caption)
  tgForm.set('parse_mode', 'HTML')
  tgForm.set('photo', photo, photo.name || 'page17.jpg')
  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {method: 'POST', body: tgForm})
  if (!tg.ok) return new Response('Telegram error', {status: 502})

  return Response.json({ok: true, status})
}
