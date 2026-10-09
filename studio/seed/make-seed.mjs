// Собирает seed.ndjson для импорта в Sanity из демо-данных сайта (web/lib/seed.json).
// Запуск: node seed/make-seed.mjs
import {readFileSync, writeFileSync} from 'node:fs'
import {randomUUID} from 'node:crypto'

const seed = JSON.parse(readFileSync(new URL('../../web/lib/seed.json', import.meta.url)))
const L = (en) => (en == null ? undefined : {_type: 'localeString', en})
const LT = (en) => (en == null ? undefined : {_type: 'localeText', en})
const key = () => randomUUID().slice(0, 12)
const docs = []
const s = seed.settings

docs.push({
  _id: 'siteSettings', _type: 'siteSettings',
  heroTitle: L(s.heroTitle), heroLede: LT(s.heroLede), hashtag: s.hashtag,
  rewardText: LT(s.rewardText), instagram: s.instagram,
})
for (const c of seed.cities)
  docs.push({
    _id: `city-${c.slug}`, _type: 'city', nameUz: c.nameUz, name: L(c.name),
    slug: {_type: 'slug', current: c.slug}, order: c.order, stampRotation: c.rot, intro: LT(c.intro),
    places: c.places.map((p) => ({_key: key(), _type: 'place', title: L(p.title), text: LT(p.text)})),
    food: c.food.map((f) => ({_key: key(), ...L(f)})),
    nextTravel: L(c.nextTravel),
  })
for (const c of seed.categories)
  docs.push({_id: `category-${c.slug}`, _type: 'category', title: L(c.title), slug: {_type: 'slug', current: c.slug}, description: LT(c.description), order: c.order})
seed.products.forEach((p, i) =>
  docs.push({
    _id: `product-${p.slug}`, _type: 'product', title: L(p.title), slug: {_type: 'slug', current: p.slug},
    category: {_type: 'reference', _ref: `category-${p.categorySlug}`}, description: LT(p.description),
    maker: p.maker || undefined, inStock: p.inStock, featured: p.featured, order: (i + 1) * 10,
  }),
)
seed.faq.forEach((q, i) => docs.push({_id: `faq-${i + 1}`, _type: 'faq', question: L(q.q), answer: LT(q.a), order: (i + 1) * 10}))

writeFileSync(new URL('./seed.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`seed.ndjson: ${docs.length} documents`)
