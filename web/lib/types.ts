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
