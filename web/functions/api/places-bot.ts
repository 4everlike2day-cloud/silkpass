// Cloudflare Pages Function: POST /api/places-bot
// Вебхук Telegram-бота @w2uz_bot «Узбекистан: что посмотреть».
// Путь пользователя: /start → язык → город → категория или 🏆 Топ → места (с фото, если есть) и кнопками 👍 / 👎.
// Любой текст, который не команда, — поиск места по названию и описанию во всех городах.
// Голоса пишутся в таблицу через веб-приложение Apps Script (tools/places-apps-script.js):
// один голос на аккаунт Telegram, повторное нажатие той же кнопки снимает голос.
// Языки: English, Русский, O'zbek. Язык хранится в данных кнопок, база пользователей не нужна.
// Описания мест пока только на русском; для EN/UZ переводятся города, категории и интерфейс.
//
// Переменные окружения в Cloudflare Pages (Settings → Variables and Secrets):
//   PLACES_BOT_TOKEN       токен @w2uz_bot от BotFather
//   PLACES_SCRIPT_URL      адрес веб-приложения Apps Script таблицы мест (…/exec)
//   PLACES_SECRET          пароль, тот же, что SECRET в свойствах скрипта
//   PLACES_WEBHOOK_SECRET  любой пароль из латиницы и цифр; тот же передаётся в setWebhook как secret_token

type Env = {PLACES_BOT_TOKEN?: string; PLACES_SCRIPT_URL?: string; PLACES_SECRET?: string; PLACES_WEBHOOK_SECRET?: string}
type Place = {id: string; city?: string; name: string; description: string; category: string; link: string; location: string; photo?: string; likes: number; dislikes: number}
type Data = {categories: string[]; places: Place[]}
type TgUser = {id: number; first_name?: string; language_code?: string}
type Update = {
  message?: {chat: {id: number; type: string}; text?: string; from?: TgUser}
  callback_query?: {id: string; data?: string; from: TgUser; message?: {chat: {id: number}; message_id: number}}
}
type Lang = 'en' | 'ru' | 'uz'

const PAGE = 5
const TOP_SIZE = 10
const TOP_MIN_VOTES = 3 // в топ попадают места, у которых не меньше 3 голосов
const SEARCH_MAX = 8
const LANGS: Lang[] = ['en', 'ru', 'uz']
const SITE: Record<Lang, string> = {en: 'https://welcome2.uz', ru: 'https://welcome2.uz/ru', uz: 'https://welcome2.uz/uz'}

// Города: порядок кнопок, значок, перевод. Название в таблице — русское.
const CITIES: {ru: string; i: string; en: string; uz: string}[] = [
  {ru: 'Ташкент', i: '🗼', en: 'Tashkent', uz: 'Toshkent'},
  {ru: 'Самарканд', i: '🕌', en: 'Samarkand', uz: 'Samarqand'},
  {ru: 'Бухара', i: '🏰', en: 'Bukhara', uz: 'Buxoro'},
  {ru: 'Хива', i: '🧱', en: 'Khiva', uz: 'Xiva'},
]
const cityName = (i: number, l: Lang) => CITIES[i][l]
const cityOf = (p: Place) => Math.max(0, CITIES.findIndex((c) => c.ru === (p.city || 'Ташкент')))

// Категории: значок и перевод. Новая категория без записи получит 📍 и русское название — добавьте её сюда.
const CAT: Record<string, {i: string; en: string; uz: string}> = {
  'История и достопримечательности': {i: '🏛', en: 'History & landmarks', uz: 'Tarix va diqqatga sazovor joylar'},
  'Архитектура': {i: '🏙', en: 'Architecture', uz: 'Arxitektura'},
  'Музеи и галереи': {i: '🖼', en: 'Museums & galleries', uz: 'Muzeylar va galereyalar'},
  'Парки и прогулки': {i: '🌳', en: 'Parks & walks', uz: "Bog'lar va sayr"},
  'Базары': {i: '🧺', en: 'Bazaars', uz: 'Bozorlar'},
  'Плов и узбекская кухня': {i: '🍛', en: 'Plov & Uzbek food', uz: "Osh va o'zbek taomlari"},
  'Кафе и кофейни': {i: '☕', en: 'Cafés & coffee', uz: 'Kafe va qahvaxonalar'},
  'Рестораны': {i: '🍽', en: 'Restaurants', uz: 'Restoranlar'},
  'Бары и ночная жизнь': {i: '🍸', en: 'Bars & nightlife', uz: 'Barlar va tungi hayot'},
  'Метро': {i: '🚇', en: 'Metro', uz: 'Metro'},
  'Мечети и святыни': {i: '🕌', en: 'Mosques & shrines', uz: 'Masjidlar va ziyoratgohlar'},
  'Смотровые площадки': {i: '🔭', en: 'Viewpoints', uz: 'Kuzatuv maydonchalari'},
  'Театры и концерты': {i: '🎭', en: 'Theatres & concerts', uz: 'Teatrlar va konsertlar'},
  'Шопинг и сувениры': {i: '🛍', en: 'Shopping & souvenirs', uz: 'Xarid va suvenirlar'},
  'С детьми': {i: '🧸', en: 'With kids', uz: 'Bolalar bilan'},
  'За городом': {i: '🏔', en: 'Out of town', uz: 'Shahar tashqarisi'},
}
const icon = (c: string) => CAT[c]?.i || '📍'
const catName = (c: string, l: Lang) => (l === 'ru' ? c : CAT[c]?.[l] || c)

const T = {
  hello: (name: string) => `👋 ${name ? `Hi, ${name}!` : 'Hi!'}\n\nI'm the Welcome 2 UZ guide to Uzbekistan.\nChoose your language · Выберите язык · Tilni tanlang`,
  intro: {
    en: (site: string) => `<b>Uzbekistan: what to see</b>\n\nHow it works:\n1️⃣ Pick a city and a category, or open 🏆 Top. I'll send places with a short description, a link and a map.\n2️⃣ Been there? Rate it 👍 or 👎. One vote per person; tap the same button again to take it back.\n3️⃣ Looking for something? Just type its name.\n\nYour votes build the rating on <a href="${site}">welcome2.uz</a>.\nCommands: /places cities · /lang language · /help this guide`,
    ru: (site: string) => `<b>Узбекистан: что посмотреть</b>\n\nКак это работает:\n1️⃣ Выберите город и категорию или откройте 🏆 Топ. Я пришлю места с описанием, ссылкой и картой.\n2️⃣ Были там? Оцените: 👍 или 👎. Один голос на человека; повторное нажатие той же кнопки отменяет голос.\n3️⃣ Ищете конкретное место? Просто напишите его название.\n\nИз ваших голосов складывается рейтинг на <a href="${site}">welcome2.uz</a>.\nКоманды: /places города · /lang язык · /help подсказка`,
    uz: (site: string) => `<b>O'zbekiston: nimani ko'rish kerak</b>\n\nQanday ishlaydi:\n1️⃣ Shahar va toifani tanlang yoki 🏆 Top'ni oching. Men joylarni qisqa tavsif, havola va xarita bilan yuboraman.\n2️⃣ U yerda bo'lganmisiz? Baholang: 👍 yoki 👎. Har kishiga bitta ovoz; o'sha tugmani qayta bossangiz, ovoz bekor qilinadi.\n3️⃣ Biror joyni qidiryapsizmi? Nomini yozing.\n\nOvozlaringizdan <a href="${site}">welcome2.uz</a> saytidagi reyting shakllanadi.\nBuyruqlar: /places shaharlar · /lang til · /help yordam`,
  },
  cities: {en: '<b>Choose a city:</b>', ru: '<b>Выберите город:</b>', uz: '<b>Shaharni tanlang:</b>'},
  soonBtn: {en: 'soon', ru: 'скоро', uz: 'tez orada'},
  soon: {en: 'This city is coming soon!', ru: 'Этот город скоро появится!', uz: "Bu shahar tez orada qo'shiladi!"},
  menu: {en: (c: string) => `<b>${c}: what to see</b>\nChoose a category:`, ru: (c: string) => `<b>${c}: что посмотреть</b>\nВыберите категорию:`, uz: (c: string) => `<b>${c}: nimani ko'rish kerak</b>\nToifani tanlang:`},
  ruNote: {en: 'Descriptions are in Russian for now, translations are coming.', ru: '', uz: 'Tavsiflar hozircha rus tilida, tarjimalar tez orada.'},
  topBtn: {en: '🏆 Top places', ru: '🏆 Топ мест', uz: '🏆 Eng yaxshi joylar'},
  topTitle: {en: (c: string) => `🏆 <b>Top places · ${c}</b>`, ru: (c: string) => `🏆 <b>Топ мест · ${c}</b>`, uz: (c: string) => `🏆 <b>Eng yaxshi joylar · ${c}</b>`},
  topHint: {en: `Places with at least ${TOP_MIN_VOTES} votes. Tap one to open it.`, ru: `Места, у которых не меньше ${TOP_MIN_VOTES} голосов. Нажмите, чтобы открыть.`, uz: `Kamida ${TOP_MIN_VOTES} ta ovozli joylar. Ochish uchun bosing.`},
  topEmpty: {en: 'Not enough votes for a top yet. Open a category and rate the places you have visited!', ru: 'Для топа пока мало голосов. Откройте категорию и оцените места, где вы были!', uz: 'Top uchun hozircha ovozlar kam. Toifani oching va borgan joylaringizni baholang!'},
  empty: {en: 'No places yet. Check back soon!', ru: 'Список мест пока пуст. Загляните позже!', uz: "Hozircha joylar yo'q. Keyinroq kiring!"},
  more: {en: (n: number) => `More (${n})`, ru: (n: number) => `Ещё ${n}`, uz: (n: number) => `Yana ${n}`},
  back: {en: '← Categories', ru: '← Категории', uz: '← Toifalar'},
  backCities: {en: '← Cities', ru: '← Города', uz: '← Shaharlar'},
  shown: {en: (a: number, b: number) => `Shown ${a} of ${b}`, ru: (a: number, b: number) => `Показано ${a} из ${b}`, uz: (a: number, b: number) => `${b} tadan ${a} tasi ko'rsatildi`},
  all: {en: "That's everything in this category.", ru: 'Это все места в категории.', uz: 'Bu toifadagi barcha joylar shu.'},
  found: {en: (q: string) => `🔎 Found for «${q}»:`, ru: (q: string) => `🔎 Нашлось по запросу «${q}»:`, uz: (q: string) => `🔎 «${q}» bo'yicha topildi:`},
  notFound: {en: (q: string) => `🔎 Nothing found for «${q}». Try another word or pick a city.`, ru: (q: string) => `🔎 По запросу «${q}» ничего не нашлось. Попробуйте другое слово или выберите город.`, uz: (q: string) => `🔎 «${q}» bo'yicha hech narsa topilmadi. Boshqa so'zni yozing yoki shaharni tanlang.`},
  link: {en: 'Link', ru: 'Ссылка', uz: 'Havola'},
  map: {en: 'Map', ru: 'На карте', uz: 'Xaritada'},
  up: {en: 'Thanks! 👍 counted', ru: 'Спасибо! 👍 учтён', uz: 'Rahmat! 👍 hisobga olindi'},
  down: {en: 'Thanks! 👎 counted', ru: 'Спасибо! 👎 учтён', uz: 'Rahmat! 👎 hisobga olindi'},
  undo: {en: 'Vote removed', ru: 'Голос снят', uz: 'Ovoz bekor qilindi'},
  fail: {en: "Couldn't save your vote, please try again", ru: 'Не получилось сохранить голос, попробуйте ещё раз', uz: "Ovozni saqlab bo'lmadi, qayta urinib ko'ring"},
  site: {en: 'All places and ratings:', ru: 'Все места и рейтинг:', uz: 'Barcha joylar va reyting:'},
  error: {en: '⚠️ The bot could not answer:', ru: '⚠️ Бот не смог ответить:', uz: '⚠️ Bot javob bera olmadi:'},
}
const COMMANDS: Record<Lang, {command: string; description: string}[]> = {
  en: [{command: 'places', description: 'Cities and places'}, {command: 'lang', description: 'Change language'}, {command: 'help', description: 'How it works'}, {command: 'site', description: 'All places and ratings'}],
  ru: [{command: 'places', description: 'Города и места'}, {command: 'lang', description: 'Сменить язык'}, {command: 'help', description: 'Как это работает'}, {command: 'site', description: 'Все места и рейтинг'}],
  uz: [{command: 'places', description: 'Shaharlar va joylar'}, {command: 'lang', description: "Tilni o'zgartirish"}, {command: 'help', description: 'Qanday ishlaydi'}, {command: 'site', description: 'Barcha joylar va reyting'}],
}

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v.trim())
const asLang = (v?: string): Lang => (v === 'ru' || v === 'uz' || v === 'en' ? v : 'en')
// Язык по умолчанию — из настроек Telegram пользователя.
const guess = (u?: TgUser): Lang => {
  const c = (u?.language_code || '').slice(0, 2)
  return c === 'ru' ? 'ru' : c === 'uz' ? 'uz' : 'en'
}
const votesOf = (p: Place) => p.likes + p.dislikes
const ratingOf = (p: Place) => (votesOf(p) ? 1 + (4 * p.likes) / votesOf(p) : 0)
// Для сортировки топа: сглаженная доля лайков, чтобы 3 голоса из 3 не обгоняли 40 из 45.
const rankOf = (p: Place) => (p.likes + 1) / (votesOf(p) + 2)
const plural = (n: number, l: Lang) => {
  if (l === 'en') return n === 1 ? 'vote' : 'votes'
  if (l === 'uz') return 'ovoz'
  const m10 = n % 10, m100 = n % 100
  return m10 === 1 && m100 !== 11 ? 'голос' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'голоса' : 'голосов'
}
const stars = (p: Place, l: Lang) => `★ ${ratingOf(p).toFixed(1).replace('.', l === 'en' ? '.' : ',')} · ${votesOf(p)} ${plural(votesOf(p), l)}`

async function tg(env: Env, method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${env.PLACES_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  })
  return res.json().catch(() => ({}))
}

// Список мест кэшируется на минуту, чтобы бот не дёргал таблицу на каждое нажатие.
// Если кэш недоступен, бот просто читает таблицу напрямую.
const CACHE_KEY = 'https://welcome2.uz/__cache/places-bot'
async function load(env: Env): Promise<Data> {
  let cache: Cache | null = null
  try {
    cache = (caches as unknown as {default: Cache}).default
    const hit = await cache.match(CACHE_KEY)
    if (hit) return hit.json()
  } catch {
    cache = null
  }
  const url = `${env.PLACES_SCRIPT_URL}?action=places&all=1&secret=${encodeURIComponent(env.PLACES_SECRET || '')}`
  const res = await fetch(url, {redirect: 'follow'})
  const raw = await res.text()
  let data: Data
  try {
    data = JSON.parse(raw) as Data
  } catch {
    throw new Error(`таблица ответила не JSON (HTTP ${res.status}): ${raw.slice(0, 120)}`)
  }
  if (!Array.isArray(data.places)) throw new Error('в ответе таблицы нет списка мест')
  if (cache) {
    try {
      await cache.put(CACHE_KEY, new Response(JSON.stringify(data), {headers: {'Cache-Control': 'max-age=60', 'Content-Type': 'application/json'}}))
    } catch {
      // кэш необязателен
    }
  }
  return data
}

async function uidOf(env: Env, user: TgUser) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${user.id}:${env.PLACES_SECRET}`))
  return [...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const voteKeyboard = (p: {id: string; likes: number; dislikes: number}, l: Lang) => ({
  inline_keyboard: [[
    {text: `👍 ${p.likes}`, callback_data: `v:${l}:${p.id}:1`},
    {text: `👎 ${p.dislikes}`, callback_data: `v:${l}:${p.id}:-1`},
  ]],
})

// Кнопки по две в ряд, длинные — по одной, чтобы Telegram не обрезал текст.
function pack(buttons: {text: string; callback_data: string}[], max = 24) {
  const rows: unknown[][] = []
  for (let i = 0; i < buttons.length; i++) {
    const a = buttons[i], b = buttons[i + 1]
    if (b && a.text.length <= max && b.text.length <= max) { rows.push([a, b]); i++ } else rows.push([a])
  }
  return rows
}

function placeText(p: Place, l: Lang, withCity = false) {
  const links = [isUrl(p.link) ? `🔗 <a href="${esc(p.link)}">${T.link[l]}</a>` : '', isUrl(p.location) ? `📍 <a href="${esc(p.location)}">${T.map[l]}</a>` : '']
    .filter(Boolean).join('  ')
  const where = withCity ? `${CITIES[cityOf(p)].i} ${cityName(cityOf(p), l)} · ${icon(p.category)} ${catName(p.category, l)}` : ''
  const rating = votesOf(p) >= TOP_MIN_VOTES ? stars(p, l) : ''
  return [`<b>${esc(p.name)}</b>`, where, esc(p.description), rating, links].filter(Boolean).join('\n')
}

// С фото — сообщение-фото с подписью, без фото или если Telegram не смог скачать картинку — обычный текст.
// Подпись к фото ограничена 1024 символами, длинное описание укорачиваем.
async function sendPlace(env: Env, chat: number, p: Place, l: Lang, withCity = false) {
  const text = placeText(p, l, withCity)
  const photo = (p.photo || '').trim()
  if (isUrl(photo)) {
    const caption = text.length <= 1024 ? text : placeText({...p, description: p.description.slice(0, Math.max(0, p.description.length - (text.length - 1000))) + '…'}, l, withCity)
    const r = (await tg(env, 'sendPhoto', {chat_id: chat, photo, caption, parse_mode: 'HTML', reply_markup: voteKeyboard(p, l)})) as {ok?: boolean}
    if (r.ok) return
  }
  await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text, link_preview_options: {is_disabled: true}, reply_markup: voteKeyboard(p, l)})
}

async function chooseLang(env: Env, chat: number, user?: TgUser) {
  await tg(env, 'sendMessage', {
    chat_id: chat,
    text: T.hello(user?.first_name || ''),
    reply_markup: {inline_keyboard: [[
      {text: '🇬🇧 English', callback_data: 'l:en'},
      {text: '🇷🇺 Русский', callback_data: 'l:ru'},
      {text: "🇺🇿 O'zbek", callback_data: 'l:uz'},
    ]]},
  })
}

async function intro(env: Env, chat: number, l: Lang) {
  await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: T.intro[l](SITE[l]), link_preview_options: {is_disabled: true}})
}

// Города: с местами — обычная кнопка с числом мест, без мест — «скоро».
async function cities(env: Env, chat: number, data: Data, l: Lang) {
  const buttons = CITIES.map((c, i) => {
    const n = data.places.filter((p) => cityOf(p) === i).length
    return n
      ? {text: `${c.i} ${c[l]} · ${n}`, callback_data: `k:${l}:${i}`}
      : {text: `${c.i} ${c[l]} · ${T.soonBtn[l]}`, callback_data: `n:${l}`}
  })
  await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: T.cities[l], reply_markup: {inline_keyboard: pack(buttons)}})
}

async function menu(env: Env, chat: number, data: Data, city: number, l: Lang) {
  const inCity = data.places.filter((p) => cityOf(p) === city)
  const used = data.categories.filter((c) => inCity.some((p) => p.category === c))
  if (!used.length) {
    await tg(env, 'sendMessage', {chat_id: chat, text: T.empty[l], reply_markup: {inline_keyboard: [[{text: T.backCities[l], callback_data: `m:${l}`}]]}})
    return
  }
  const buttons = used.map((c) => ({text: `${icon(c)} ${catName(c, l)} · ${inCity.filter((p) => p.category === c).length}`, callback_data: `c:${l}:${city}:${data.categories.indexOf(c)}:0`}))
  const rows = [[{text: T.topBtn[l], callback_data: `t:${l}:${city}`}], ...pack(buttons), [{text: T.backCities[l], callback_data: `m:${l}`}]]
  const note = T.ruNote[l] ? `\n<i>${T.ruNote[l]}</i>` : ''
  await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: T.menu[l](cityName(city, l)) + note, reply_markup: {inline_keyboard: rows}})
}

async function category(env: Env, chat: number, data: Data, city: number, idx: number, offset: number, l: Lang) {
  const name = data.categories[idx]
  const list = data.places.filter((p) => cityOf(p) === city && p.category === name)
  const page = list.slice(offset, offset + PAGE)
  if (!page.length) return menu(env, chat, data, city, l)
  if (offset === 0) await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: `${icon(name)} <b>${esc(catName(name, l))}</b> · ${cityName(city, l)}`})
  for (const p of page) await sendPlace(env, chat, p, l)
  const nav: unknown[] = []
  const left = list.length - offset - page.length
  if (left > 0) nav.push({text: T.more[l](left), callback_data: `c:${l}:${city}:${idx}:${offset + PAGE}`})
  nav.push({text: T.back[l], callback_data: `k:${l}:${city}`})
  await tg(env, 'sendMessage', {chat_id: chat, text: left > 0 ? T.shown[l](offset + page.length, list.length) : T.all[l], reply_markup: {inline_keyboard: [nav]}})
}

// Топ: места города, у которых не меньше TOP_MIN_VOTES голосов; порядок по сглаженному рейтингу (rankOf).
async function top(env: Env, chat: number, data: Data, city: number, l: Lang) {
  const list = data.places
    .filter((p) => cityOf(p) === city && votesOf(p) >= TOP_MIN_VOTES)
    .sort((a, b) => rankOf(b) - rankOf(a) || votesOf(b) - votesOf(a))
    .slice(0, TOP_SIZE)
  const back = [{text: T.back[l], callback_data: `k:${l}:${city}`}]
  if (!list.length) {
    await tg(env, 'sendMessage', {chat_id: chat, parse_mode: 'HTML', text: `${T.topTitle[l](cityName(city, l))}\n\n${T.topEmpty[l]}`, reply_markup: {inline_keyboard: [back]}})
    return
  }
  const medal = (i: number) => ['🥇', '🥈', '🥉'][i] || `${i + 1}.`
  const lines = list.map((p, i) => `${medal(i)} <b>${esc(p.name)}</b> — ${stars(p, l)}`)
  const buttons = list.map((p, i) => [{text: `${medal(i)} ${p.name}`, callback_data: `p:${l}:${p.id}`}])
  await tg(env, 'sendMessage', {
    chat_id: chat,
    parse_mode: 'HTML',
    text: `${T.topTitle[l](cityName(city, l))}\n\n${lines.join('\n')}\n\n<i>${T.topHint[l]}</i>`,
    reply_markup: {inline_keyboard: [...buttons, back]},
  })
}

// Поиск без учёта регистра, «ё/е» и кавычек, по названию и описанию, во всех городах.
const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[«»"'`ʻʼ’]/g, '').replace(/\s+/g, ' ').trim()
async function search(env: Env, chat: number, data: Data, query: string, l: Lang) {
  const q = norm(query)
  const shown = esc(query.trim().slice(0, 40))
  const inName = data.places.filter((p) => norm(p.name).includes(q))
  const inText = data.places.filter((p) => !inName.includes(p) && norm(p.description).includes(q))
  const hits = q.length >= 2 ? [...inName, ...inText].slice(0, SEARCH_MAX) : []
  if (!hits.length) {
    await tg(env, 'sendMessage', {chat_id: chat, text: T.notFound[l](shown), reply_markup: {inline_keyboard: [[{text: T.backCities[l], callback_data: `m:${l}`}]]}})
    return
  }
  if (hits.length === 1) return sendPlace(env, chat, hits[0], l, true)
  const buttons = hits.map((p) => [{text: `${CITIES[cityOf(p)].i} ${p.name}`, callback_data: `p:${l}:${p.id}`}])
  await tg(env, 'sendMessage', {chat_id: chat, text: T.found[l](shown), reply_markup: {inline_keyboard: buttons}})
}

async function vote(env: Env, cb: NonNullable<Update['callback_query']>, place: string, v: number, l: Lang) {
  const res = await fetch(env.PLACES_SCRIPT_URL!, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({secret: env.PLACES_SECRET, action: 'vote', place, uid: await uidOf(env, cb.from), v, toggle: true}),
    redirect: 'follow',
  })
  const r = (await res.json().catch(() => ({}))) as {likes?: number; dislikes?: number; v?: number; error?: string}
  if (r.error || r.likes === undefined) {
    await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id, text: T.fail[l]})
    return
  }
  await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id, text: r.v === 0 ? T.undo[l] : r.v === 1 ? T.up[l] : T.down[l]})
  if (cb.message) {
    await tg(env, 'editMessageReplyMarkup', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      reply_markup: voteKeyboard({id: place, likes: r.likes, dislikes: r.dislikes ?? 0}, l),
    })
  }
}

// Меню команд бота на трёх языках. Ставится при /start, повторный вызов ничего не ломает.
async function setCommands(env: Env) {
  await Promise.all([
    tg(env, 'setMyCommands', {commands: COMMANDS.en}),
    tg(env, 'setMyCommands', {commands: COMMANDS.ru, language_code: 'ru'}),
    tg(env, 'setMyCommands', {commands: COMMANDS.uz, language_code: 'uz'}),
  ])
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

  let l: Lang = guess(u.message?.from || u.callback_query?.from)
  try {
    if (u.message && u.message.chat.type === 'private') {
      const chat = u.message.chat.id
      const text = (u.message.text || '').trim()
      const cmd = text.startsWith('/') ? text.split(/[\s@]/)[0].toLowerCase() : ''
      if (cmd === '/start' || cmd === '/lang') {
        if (cmd === '/start') await setCommands(env)
        await chooseLang(env, chat, u.message.from)
      } else if (cmd === '/help') {
        await intro(env, chat, l)
      } else if (cmd === '/site') {
        await tg(env, 'sendMessage', {chat_id: chat, text: `${T.site[l]} ${SITE[l]}`})
      } else if (cmd || !text) {
        await cities(env, chat, await load(env), l)
      } else {
        await search(env, chat, await load(env), text, l)
      }
    } else if (u.callback_query) {
      const cb = u.callback_query
      const parts = (cb.data || '').split(':')
      const chat = cb.message?.chat.id
      const kind = parts[0]
      // Кнопки прошлых версий бота: без языка (v:ID:1, c:IDX:OFF, m) — русские; без города (c:LANG:IDX:OFF) — Ташкент.
      const legacy = !LANGS.includes(parts[1] as Lang)
      l = legacy ? 'ru' : asLang(parts[1])
      let args = legacy ? parts.slice(1) : parts.slice(2)
      if (kind === 'c' && args.length === 2) args = ['0', ...args]

      if (kind === 'v') {
        await vote(env, cb, args[0], Number(args[1]), l)
      } else if (kind === 'n') {
        await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id, text: T.soon[l]})
      } else if (chat) {
        await tg(env, 'answerCallbackQuery', {callback_query_id: cb.id})
        const data = await load(env)
        const city = Math.min(Math.max(Number(args[0]) || 0, 0), CITIES.length - 1)
        if (kind === 'l') {
          await intro(env, chat, l)
          await cities(env, chat, data, l)
        } else if (kind === 'k') {
          await menu(env, chat, data, city, l)
        } else if (kind === 'c') {
          await category(env, chat, data, city, Number(args[1]), Number(args[2]) || 0, l)
        } else if (kind === 't') {
          await top(env, chat, data, city, l)
        } else if (kind === 'p') {
          const p = data.places.find((x) => x.id === args[0])
          if (p) await sendPlace(env, chat, p, l, true)
        } else {
          await cities(env, chat, data, l)
        }
      }
    }
  } catch (e) {
    // Telegram повторяет вебхук при ошибке; отвечаем 200, чтобы не получить лавину повторов.
    // Причину пишем в чат, чтобы сразу было видно, что сломалось.
    const chat = u.message?.chat.id ?? u.callback_query?.message?.chat.id
    if (chat) await tg(env, 'sendMessage', {chat_id: chat, text: `${T.error[l]} ${e instanceof Error ? e.message : String(e)}`}).catch(() => {})
  }
  return new Response('ok')
}
