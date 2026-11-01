import {sanity} from './sanity'
import type {Lang} from './i18n'
import type {Gift} from './types'

// Подарки за пройденный маршрут. Основной список ведётся в Sanity («Подарки за маршрут»).
// Пока в Sanity нет ни одного подарка, сайт показывает этот стартовый список.
type L = Record<Lang, string>
const FALLBACK: {id: string; title: L; text: L}[] = [
  {
    id: 'promo-passport',
    title: {en: '20% off a passport', ru: 'Скидка 20% на паспорт', uz: "Pasportga 20% chegirma"},
    text: {
      en: 'A promo code for our shop: one more passport for yourself or as a gift to a friend.',
      ru: 'Промокод в наш шоп: ещё один паспорт себе или в подарок другу.',
      uz: "Do'konimiz uchun promokod: o'zingizga yoki do'stingizga yana bitta pasport.",
    },
  },
  {
    id: 'postcards',
    title: {en: 'Three themed postcards', ru: 'Три тематические открытки', uz: 'Uchta mavzuli otkritka'},
    text: {en: 'A set of postcards from the route.', ru: 'Набор открыток с видами маршрута.', uz: "Yo'nalish manzaralari tushirilgan otkritkalar to'plami."},
  },
  {
    id: 'stickers-food',
    title: {en: 'Sticker pack: food', ru: 'Стикерпак «Еда»', uz: "Stikerlar to'plami: taomlar"},
    text: {en: 'Plov, samsa, non and other dishes of the route.', ru: 'Плов, самса, нон и другие блюда маршрута.', uz: "Osh, somsa, non va yo'nalishning boshqa taomlari."},
  },
  {
    id: 'stickers-metro',
    title: {en: 'Sticker pack: metro', ru: 'Стикерпак «Метро»', uz: "Stikerlar to'plami: metro"},
    text: {en: 'The most beautiful Tashkent metro stations.', ru: 'Самые красивые станции ташкентского метро.', uz: "Toshkent metrosining eng chiroyli bekatlari."},
  },
  {
    id: 'stickers-cities',
    title: {en: 'Sticker pack: cities', ru: 'Стикерпак «Города»', uz: "Stikerlar to'plami: shaharlar"},
    text: {en: 'Tashkent, Samarkand, Bukhara and Khiva.', ru: 'Ташкент, Самарканд, Бухара и Хива.', uz: 'Toshkent, Samarqand, Buxoro va Xiva.'},
  },
  {
    id: 'magnet-ceramic',
    title: {en: 'Handmade ceramic magnet', ru: 'Керамический магнит ручной работы', uz: "Qo'lda yasalgan sopol magnit"},
    text: {en: 'Painted by local craftspeople.', ru: 'Роспись местных мастеров.', uz: 'Mahalliy hunarmandlar bezagan.'},
  },
  {
    id: 'magnet-stamp',
    title: {en: 'Stamp magnet', ru: 'Магнит-печать', uz: 'Muhr shaklidagi magnit'},
    text: {en: 'A square magnet in the shape of a city stamp.', ru: 'Квадратный магнит в виде печати города.', uz: 'Shahar muhri shaklidagi kvadrat magnit.'},
  },
]

const t = (field: string) => `coalesce(${field}[$lang], ${field}.en)`
const QUERY = `{
  "total": count(*[_type == "gift"]),
  "list": *[_type == "gift" && active != false] | order(order asc){"id": _id, "title": ${t('title')}, "text": ${t('text')}}
}`

const cache = new Map<Lang, Promise<Gift[]>>()

export function getGifts(lang: Lang = 'en'): Promise<Gift[]> {
  if (!cache.has(lang)) {
    cache.set(lang, (async () => {
      const res = sanity ? await sanity.fetch<{total: number; list: Gift[]}>(QUERY, {lang}).catch(() => null) : null
      if (res && res.total > 0) return res.list
      return FALLBACK.map((g) => ({id: g.id, title: g.title[lang], text: g.text[lang]}))
    })())
  }
  return cache.get(lang)!
}
