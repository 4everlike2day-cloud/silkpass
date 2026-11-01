import seed from './seed.json'
import {Q, sanity} from './sanity'
import {translateContent} from './contentTr'
import {localGuides} from './localGuides'
import type {Lang} from './i18n'
import type {Ad, Category, City, Deal, Faq, Guide, Partner, Product, Settings} from './types'

// Все загрузчики принимают язык. Sanity отдаёт поле на этом языке, а если перевода нет, английское.
// Английский текст из базового контента переводится по таблице lib/contentTr.ts.
const cache = new Map<string, Promise<unknown>>()

function load<T>(name: string, query: string, fallback: T, lang: Lang): Promise<T> {
  const key = `${name}:${lang}`
  if (!cache.has(key)) {
    const p = (async () => {
      const res = sanity ? await sanity.fetch<T>(query, {lang}) : null
      return translateContent((res ?? fallback) as T, lang)
    })()
    cache.set(key, p)
  }
  return cache.get(key) as Promise<T>
}

const fallbackSettings = seed.settings as Settings

export async function getSettings(lang: Lang = 'en'): Promise<Settings> {
  const s = await load<Partial<Settings> | null>('settings', Q.settings, fallbackSettings, lang)
  return {...translateContent(fallbackSettings, lang), ...(s || {})} as Settings
}
export async function getCities(lang: Lang = 'en'): Promise<City[]> {
  const list = await load<City[]>('cities', Q.cities, seed.cities as City[], lang)
  // В Sanity блюда приходят объектами {t}, в демо-данных строками.
  return list.map((c) => ({...c, food: (c.food as unknown[]).map((f) => (typeof f === 'string' ? f : (f as {t: string}).t))}))
}
export async function getCity(slug: string, lang: Lang = 'en') {
  return (await getCities(lang)).find((c) => c.slug === slug) || null
}
export const getPartners = (lang: Lang = 'en') => load<Partner[]>('partners', Q.partners, seed.partners as Partner[], lang)
export const getDeals = (lang: Lang = 'en') => load<Deal[]>('deals', Q.deals, seed.deals as Deal[], lang)
export const getAds = (lang: Lang = 'en') => load<Ad[]>('ads', Q.ads, seed.ads as Ad[], lang)
export const getCategories = (lang: Lang = 'en') => load<Category[]>('categories', Q.categories, seed.categories as Category[], lang)
export const getProducts = (lang: Lang = 'en') => load<Product[]>('products', Q.products, seed.products as Product[], lang)
export const getFaq = (lang: Lang = 'en') => load<Faq[]>('faq', Q.faq, seed.faq as Faq[], lang)

// Подборки из Sanity + подборки, которые лежат в коде (lib/localGuides.ts). Если в Sanity есть подборка
// с тем же городом и адресом, берётся версия из Sanity.
export async function getGuides(lang: Lang = 'en'): Promise<Guide[]> {
  const remote = await load<Guide[]>('guides', Q.guides, ((seed as {guides?: Guide[]}).guides || []) as Guide[], lang)
  const key = (g: Guide) => `${g.citySlug}/${g.slug}`
  const taken = new Set(remote.map(key))
  return [...remote, ...localGuides(lang).filter((g) => !taken.has(key(g)))].sort((a, b) => a.order - b.order)
}

export {pad} from './format'
