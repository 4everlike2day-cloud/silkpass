import type {City} from './types'

// Значения по умолчанию. В Sanity у города можно задать свои ссылки, они важнее.
const WIKI: Record<string, string> = {
  tashkent: 'https://en.wikipedia.org/wiki/Tashkent',
  samarkand: 'https://en.wikipedia.org/wiki/Samarkand',
  bukhara: 'https://en.wikipedia.org/wiki/Bukhara',
  khiva: 'https://en.wikipedia.org/wiki/Khiva',
}
const EVENTS: Record<string, {url: string; label: string}> = {
  tashkent: {url: 'https://www.afisha.uz/ru/calendar', label: 'Afisha.uz · concerts, theatre, exhibitions (in Russian)'},
}

export function wikiUrl(c: City) {
  return c.wikiUrl || WIKI[c.slug] || `https://en.wikipedia.org/wiki/${encodeURIComponent(c.name)}`
}
export function events(c: City) {
  if (c.eventsUrl) return {url: c.eventsUrl, label: c.eventsLabel || 'Events calendar'}
  return EVENTS[c.slug] || null
}
