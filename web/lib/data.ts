import seed from './seed.json'
import {Q, sanity} from './sanity'
import type {Ad, Category, City, Deal, Faq, Partner, Product, Settings} from './types'

// Пока сайт только на английском. Когда запустим RU/UZ, язык будет передаваться сюда.
const LANG = 'en'

async function load<T>(query: string, fallback: T): Promise<T> {
  if (!sanity) return fallback
  const res = await sanity.fetch<T>(query, {lang: LANG})
  return (res ?? fallback) as T
}

const fallbackSettings = seed.settings as Settings

export async function getSettings(): Promise<Settings> {
  const s = await load<Partial<Settings> | null>(Q.settings, fallbackSettings)
  return {...fallbackSettings, ...(s || {})} as Settings
}
let citiesCache: Promise<City[]> | null = null
export function getCities() {
  citiesCache ||= load<City[]>(Q.cities, seed.cities as City[]).then((list) =>
    // В Sanity блюда приходят объектами {t}, в демо-данных строками.
    list.map((c) => ({...c, food: (c.food as unknown[]).map((f) => (typeof f === 'string' ? f : (f as {t: string}).t))})),
  )
  return citiesCache
}
export async function getCity(slug: string) {
  return (await getCities()).find((c) => c.slug === slug) || null
}
export const getPartners = () => load<Partner[]>(Q.partners, seed.partners as Partner[])
export const getDeals = () => load<Deal[]>(Q.deals, seed.deals as Deal[])
export const getAds = () => load<Ad[]>(Q.ads, seed.ads as Ad[])
export const getCategories = () => load<Category[]>(Q.categories, seed.categories as Category[])
export const getProducts = () => load<Product[]>(Q.products, seed.products as Product[])
export const getFaq = () => load<Faq[]>(Q.faq, seed.faq as Faq[])

export {pad, formatPrice} from './format'
