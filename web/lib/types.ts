export type Img = {url: string; alt?: string} | null

export type Settings = {
  heroTitle: string
  heroLede: string
  hashtag: string
  passportPrice: number | null
  rewardText: string
  instagram: string | null
  telegram: string | null
  whatsapp: string | null
  email: string | null
}

export type Place = {title: string; text: string; mapsUrl: string | null}

export type City = {
  slug: string
  nameUz: string
  name: string
  order: number
  rot: number
  intro: string
  places: Place[]
  food: string[]
  nextTravel: string | null
  image: Img
  wikiUrl?: string | null
  eventsUrl?: string | null
  eventsLabel?: string | null
}

export type GuideItem = {
  title: string
  text: string | null
  image: Img
  images?: NonNullable<Img>[]
  mapsUrl: string | null
  lat?: number | null
  lon?: number | null
  area?: string | null
  credit?: string | null
}
export type Guide = {
  slug: string
  citySlug: string
  title: string
  summary: string | null
  cover: Img
  intro: string | null
  items: GuideItem[]
  gallery: NonNullable<Img>[]
  order: number
  sourceUrl?: string | null
  sourceLabel?: string | null
  sourceText?: string | null
  // Картинка-схема после вступления (например, схема метро) с подписью автора и ссылкой на скачивание.
  scheme?: {image: string; alt: string; credit: string; creditUrl?: string; downloadUrl?: string; downloadLabel?: string} | null
  // Заметка после карточек (выделенный блок).
  note?: {title: string; text: string} | null
}

export type Role = 'stamp' | 'sales' | 'deal' | 'ad'

export type Partner = {
  id: string
  name: string
  citySlug: string
  roles: Role[]
  kind: string | null
  address: string | null
  hours: string | null
  mapsUrl: string | null
  yandexUrl: string | null
  website: string | null
  logo: Img
}

export type Deal = {text: string; partnerName: string; citySlug: string}
export type Ad = {citySlug: string; title: string; text: string | null; url: string | null; image: Img}
export type Category = {slug: string; title: string; description: string | null; order: number}
export type Product = {
  slug: string
  title: string
  categorySlug: string
  price: number | null
  oldPrice: number | null
  images: NonNullable<Img>[]
  description: string | null
  maker: string | null
  inStock: boolean
  featured: boolean
}
export type Faq = {q: string; a: string}
