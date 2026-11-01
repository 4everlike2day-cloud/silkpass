import type {Lang} from './i18n'
import type {City} from './types'

// Значения по умолчанию. В Sanity у города можно задать свои ссылки, они важнее (для английской версии).
const WIKI: Record<Lang, Record<string, string>> = {
  en: {
    tashkent: 'https://en.wikipedia.org/wiki/Tashkent',
    samarkand: 'https://en.wikipedia.org/wiki/Samarkand',
    bukhara: 'https://en.wikipedia.org/wiki/Bukhara',
    khiva: 'https://en.wikipedia.org/wiki/Khiva',
  },
  ru: {
    tashkent: 'https://ru.wikipedia.org/wiki/Ташкент',
    samarkand: 'https://ru.wikipedia.org/wiki/Самарканд',
    bukhara: 'https://ru.wikipedia.org/wiki/Бухара',
    khiva: 'https://ru.wikipedia.org/wiki/Хива',
  },
  uz: {
    tashkent: 'https://uz.wikipedia.org/wiki/Toshkent',
    samarkand: 'https://uz.wikipedia.org/wiki/Samarqand',
    bukhara: 'https://uz.wikipedia.org/wiki/Buxoro',
    khiva: 'https://uz.wikipedia.org/wiki/Xiva',
  },
}
const EVENTS: Record<string, {url: string; image?: string; label: Record<Lang, string>}> = {
  tashkent: {
    url: 'https://www.afisha.uz/ru/calendar',
    image: '/links/afishauz-cover.png',
    label: {
      en: 'Afisha.uz · concerts, theatre, exhibitions (in Russian)',
      ru: 'Afisha.uz · концерты, театры, выставки',
      uz: "Afisha.uz · konsertlar, teatrlar, ko'rgazmalar",
    },
  },
}

export function wikiUrl(c: City, lang: Lang = 'en') {
  if (lang === 'en' && c.wikiUrl) return c.wikiUrl
  return WIKI[lang][c.slug] || c.wikiUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(c.slug)}`
}
export function events(c: City, lang: Lang = 'en') {
  const e = EVENTS[c.slug]
  if (c.eventsUrl) return {url: c.eventsUrl, label: c.eventsLabel || 'Events calendar', image: e && e.url === c.eventsUrl ? e.image : undefined}
  return e ? {url: e.url, label: e.label[lang], image: e.image} : null
}
