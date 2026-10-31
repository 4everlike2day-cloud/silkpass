import type {Lang} from './i18n'

// «Что посмотреть»: места из Google-таблицы «Узбекистан: что посмотреть».
// Данные отдаёт функция Cloudflare /api/places (functions/api/places.ts), она же принимает предложения мест.
// При сборке сайта места берутся с боевого сайта, чтобы они были в HTML (для поиска и без JS);
// в браузере страница сразу подтягивает свежий список и рейтинг.

export type Place = {
  id: string; city: string; name: string; description: string; category: string
  link: string; location: string; photo: string; likes: number; dislikes: number
}

// Города: адрес страницы → название в таблице. Страница /<город>/places собирается только для включённых городов.
export const PLACE_CITIES: {slug: string; sheet: string; enabled: boolean}[] = [
  {slug: 'tashkent', sheet: 'Ташкент', enabled: true},
  {slug: 'samarkand', sheet: 'Самарканд', enabled: false},
  {slug: 'bukhara', sheet: 'Бухара', enabled: false},
  {slug: 'khiva', sheet: 'Хива', enabled: false},
]
export const placesEnabled = (slug: string) => PLACE_CITIES.some((c) => c.slug === slug && c.enabled)
export const sheetCity = (slug: string) => PLACE_CITIES.find((c) => c.slug === slug)?.sheet || ''

// Категории в том же порядке, что на листе «Категории». Новая категория без записи покажется со значком 📍 и русским названием.
export const CATEGORIES: {ru: string; i: string; en: string; uz: string}[] = [
  {ru: 'История и достопримечательности', i: '🏛', en: 'History & landmarks', uz: 'Tarix va diqqatga sazovor joylar'},
  {ru: 'Архитектура', i: '🏙', en: 'Architecture', uz: 'Arxitektura'},
  {ru: 'Музеи и галереи', i: '🖼', en: 'Museums & galleries', uz: 'Muzeylar va galereyalar'},
  {ru: 'Парки и прогулки', i: '🌳', en: 'Parks & walks', uz: "Bog'lar va sayr"},
  {ru: 'Базары', i: '🧺', en: 'Bazaars', uz: 'Bozorlar'},
  {ru: 'Плов и узбекская кухня', i: '🍛', en: 'Plov & Uzbek food', uz: "Osh va o'zbek taomlari"},
  {ru: 'Кафе и кофейни', i: '☕', en: 'Cafés & coffee', uz: 'Kafe va qahvaxonalar'},
  {ru: 'Рестораны', i: '🍽', en: 'Restaurants', uz: 'Restoranlar'},
  {ru: 'Бары и ночная жизнь', i: '🍸', en: 'Bars & nightlife', uz: 'Barlar va tungi hayot'},
  {ru: 'Метро', i: '🚇', en: 'Metro', uz: 'Metro'},
  {ru: 'Мечети и святыни', i: '🕌', en: 'Mosques & shrines', uz: 'Masjidlar va ziyoratgohlar'},
  {ru: 'Смотровые площадки', i: '🔭', en: 'Viewpoints', uz: 'Kuzatuv maydonchalari'},
  {ru: 'Театры и концерты', i: '🎭', en: 'Theatres & concerts', uz: 'Teatrlar va konsertlar'},
  {ru: 'Шопинг и сувениры', i: '🛍', en: 'Shopping & souvenirs', uz: 'Xarid va suvenirlar'},
  {ru: 'С детьми', i: '🧸', en: 'With kids', uz: 'Bolalar bilan'},
  {ru: 'За городом', i: '🏔', en: 'Out of town', uz: 'Shahar tashqarisi'},
]
export const catIcon = (c: string) => CATEGORIES.find((x) => x.ru === c)?.i || '📍'
export const catName = (c: string, l: Lang) => (l === 'ru' ? c : CATEGORIES.find((x) => x.ru === c)?.[l] || c)
export const catOrder = (c: string) => {
  const i = CATEGORIES.findIndex((x) => x.ru === c)
  return i < 0 ? 999 : i
}

export const MIN_VOTES = 3 // звёзды показываем, когда у места не меньше 3 голосов (как в боте)
export const votesOf = (p: Place) => p.likes + p.dislikes
export const ratingOf = (p: Place) => (votesOf(p) ? 1 + (4 * p.likes) / votesOf(p) : 0)
// Порядок «сначала популярные»: сглаженная доля лайков, чтобы 3 из 3 не обгоняли 40 из 45.
export const rankOf = (p: Place) => (p.likes + 1) / (votesOf(p) + 2)

export const BOT = 'w2uz_bot'
export const botLink = (id?: string) => `https://t.me/${BOT}${id ? `?start=p_${id}` : ''}`

const SITE = 'https://welcome2.uz'

/** Места города для сборки. Если сайт или таблица недоступны, отдаём пустой список: страница догрузит места в браузере. */
export async function getPlaces(slug: string): Promise<Place[]> {
  try {
    const res = await fetch(`${SITE}/api/places?city=${encodeURIComponent(slug)}`, {signal: AbortSignal.timeout(10000)})
    if (!res.ok) return []
    const data = (await res.json()) as {places?: Place[]}
    return Array.isArray(data.places) ? data.places : []
  } catch {
    return []
  }
}
