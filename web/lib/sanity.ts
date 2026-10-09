import {createClient, type SanityClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Если ID проекта не задан, сайт работает на демо-данных из lib/seed.json.
export const sanity: SanityClient | null = projectId
  ? createClient({projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published'})
  : null

// Перевод: берём выбранный язык, а если его нет, английский.
const t = (field: string) => `coalesce(${field}[$lang], ${field}.en)`
const img = (field: string) => `select(defined(${field}.asset) => {"url": ${field}.asset->url, "alt": ""}, null)`

export const Q = {
  settings: `*[_id == "siteSettings"][0]{
    "heroTitle": ${t('heroTitle')}, "heroLede": ${t('heroLede')}, hashtag, passportPrice,
    "rewardText": ${t('rewardText')}, instagram, telegram, whatsapp, email
  }`,
  cities: `*[_type == "city" && defined(slug.current)] | order(order asc){
    "slug": slug.current, nameUz, "name": ${t('name')}, order, "rot": coalesce(stampRotation, 0),
    "intro": ${t('intro')},
    "places": coalesce(places[]{"title": ${t('title')}, "text": ${t('text')}, "mapsUrl": coalesce(mapsUrl, null)}, []),
    "food": coalesce(food[]{"t": ${t('@')}}, []),
    "nextTravel": ${t('nextTravel')},
    "image": ${img('heroImage')}
  }`,
  partners: `*[_type == "partner" && active != false]{
    "id": _id, name, "citySlug": city->slug.current, "roles": coalesce(roles, []),
    "kind": ${t('kind')}, "address": ${t('address')}, hours, mapsUrl, yandexUrl, website,
    "logo": ${img('logo')}
  }`,
  deals: `*[_type == "deal" && active != false && (!defined(validUntil) || validUntil >= now())]{
    "text": ${t('text')}, "partnerName": partner->name, "citySlug": partner->city->slug.current
  }`,
  ads: `*[_type == "adSlot" && active != false && (!defined(from) || from <= now()) && (!defined(until) || until >= now())]{
    "citySlug": city->slug.current, "title": ${t('title')}, "text": ${t('text')}, url, "image": ${img('image')}
  }`,
  categories: `*[_type == "category" && defined(slug.current)] | order(order asc){
    "slug": slug.current, "title": ${t('title')}, "description": ${t('description')}, order
  }`,
  products: `*[_type == "product" && defined(slug.current)] | order(order asc){
    "slug": slug.current, "title": ${t('title')}, "categorySlug": category->slug.current,
    price, oldPrice, "images": coalesce(images[defined(asset)]{"url": asset->url, "alt": ""}, []),
    "description": ${t('description')}, maker, "inStock": inStock != false, "featured": featured == true
  }`,
  faq: `*[_type == "faq"] | order(order asc){"q": ${t('question')}, "a": ${t('answer')}}`,
}
