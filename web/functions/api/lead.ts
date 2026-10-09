// Cloudflare Pages Function: POST /api/lead
// Принимает заказы, заявки партнёров и подписки на шоп и отправляет их в ваш Telegram.
// Нужные переменные окружения в Cloudflare Pages (Settings → Environment variables):
//   TELEGRAM_BOT_TOKEN  токен бота от @BotFather
//   TELEGRAM_CHAT_ID    ID чата или группы, куда слать сообщения

type Env = {TELEGRAM_BOT_TOKEN?: string; TELEGRAM_CHAT_ID?: string}
type Item = {title?: string; qty?: number; price?: number}

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 1000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const money = (n: unknown) => (typeof n === 'number' ? `${n.toLocaleString('en-US').replace(/,/g, ' ')} сум` : '—')

function format(d: Record<string, any>): string | null {
  switch (d.kind) {
    case 'order': {
      const items: Item[] = Array.isArray(d.items) ? d.items.slice(0, 50) : []
      if (!items.length) return null
      const lines = items.map((i) => `• ${esc(i.title)} × ${Number(i.qty) || 1} = ${money((Number(i.price) || 0) * (Number(i.qty) || 1))}`)
      return [
        '🛒 <b>Новый заказ</b>',
        ...lines,
        `<b>Итого:</b> ${money(d.total)}`,
        '',
        `<b>Имя:</b> ${esc(d.name)}`,
        `<b>Контакт:</b> ${esc(d.contact)}`,
        `<b>Город:</b> ${esc(d.city)}`,
        `<b>Адрес:</b> ${esc(d.address)}`,
        d.note ? `<b>Комментарий:</b> ${esc(d.note)}` : '',
      ].filter(Boolean).join('\n')
    }
    case 'partner':
      return [
        '🤝 <b>Заявка партнёра</b>',
        `<b>Бизнес:</b> ${esc(d.business)}`,
        `<b>Город:</b> ${esc(d.city)}`,
        `<b>Формат:</b> ${esc(d.format)}`,
        `<b>Контакт:</b> ${esc(d.contact)}`,
        d.note ? `<b>Комментарий:</b> ${esc(d.note)}` : '',
      ].filter(Boolean).join('\n')
    case 'notify':
      return `🔔 <b>Подписка на новости шопа</b>\n${esc(d.email)}`
    default:
      return null
  }
}

export const onRequestPost = async ({request, env}: {request: Request; env: Env}) => {
  let data: Record<string, any>
  try {
    data = await request.json()
  } catch {
    return new Response('Bad JSON', {status: 400})
  }
  // Ловушка для спам-ботов: скрытое поле website должно быть пустым.
  if (data.website) return Response.json({ok: true})

  const text = format(data)
  if (!text) return new Response('Bad request', {status: 400})
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return new Response('Telegram is not configured', {status: 500})

  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true}),
  })
  if (!tg.ok) return new Response('Telegram error', {status: 502})
  return Response.json({ok: true})
}
