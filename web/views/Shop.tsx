import Link from 'next/link'
import {notFound} from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import AddToCart from '@/components/AddToCart'
import {getCategories, getProducts} from '@/lib/data'
import {formatPriceL, href, t, type Lang} from '@/lib/i18n'
import type {Category} from '@/lib/types'

function CategoryNav({cats, current, lang}: {cats: Category[]; current?: string; lang: Lang}) {
  return (
    <nav className="cats" aria-label="Categories">
      <Link href={href(lang, '/shop')} aria-current={!current ? 'page' : undefined}>{t(lang).shop.all}</Link>
      {cats.map((c) => <Link key={c.slug} href={href(lang, `/shop/${c.slug}`)} aria-current={current === c.slug ? 'page' : undefined}>{c.title}</Link>)}
    </nav>
  )
}

export const shopMeta = (lang: Lang) => ({title: t(lang).shop.label})

export async function Shop({lang}: {lang: Lang}) {
  const s = t(lang).shop
  const [cats, products] = await Promise.all([getCategories(lang), getProducts(lang)])
  return (
    <section>
      <div className="wrap">
        <p className="label">{s.label}</p>
        <h1 style={{marginTop: 18, marginBottom: 28}}>{s.title}</h1>
        <CategoryNav cats={cats} lang={lang} />
        <div style={{display: 'grid', gap: 48}}>
          {cats.map((c) => {
            const items = products.filter((p) => p.categorySlug === c.slug)
            if (!items.length) return null
            return (
              <div key={c.slug}>
                <div className="sec-head"><h2>{c.title}</h2>{c.description && <p className="muted">{c.description}</p>}</div>
                <div className="grid4">{items.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const categoryParams = async () => (await getCategories()).map((c) => ({category: c.slug}))
export async function categoryMeta(lang: Lang, category: string) {
  const c = (await getCategories(lang)).find((x) => x.slug === category)
  return c ? {title: `${c.title} · ${t(lang).shop.label}`} : {}
}

export async function CategoryPage({lang, category}: {lang: Lang; category: string}) {
  const s = t(lang).shop
  const [cats, products] = await Promise.all([getCategories(lang), getProducts(lang)])
  const cat = cats.find((c) => c.slug === category)
  if (!cat) notFound()
  const items = products.filter((p) => p.categorySlug === cat.slug)
  return (
    <section>
      <div className="wrap">
        <p className="label">{s.label}</p>
        <h1 style={{marginTop: 18, marginBottom: 12}}>{cat.title}</h1>
        {cat.description && <p className="muted" style={{marginBottom: 28, maxWidth: '56ch'}}>{cat.description}</p>}
        <CategoryNav cats={cats} current={cat.slug} lang={lang} />
        {items.length ? <div className="grid4">{items.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div> : <p className="muted">{s.soon}</p>}
      </div>
    </section>
  )
}

export const productParams = async () => (await getProducts()).map((p) => ({slug: p.slug}))
export async function productMeta(lang: Lang, slug: string) {
  const p = (await getProducts(lang)).find((x) => x.slug === slug)
  return p ? {title: p.title, description: p.description || undefined} : {}
}

export async function ProductPage({lang, slug}: {lang: Lang; slug: string}) {
  const s = t(lang).shop
  const [products, cats] = await Promise.all([getProducts(lang), getCategories(lang)])
  const p = products.find((x) => x.slug === slug)
  if (!p) notFound()
  const cat = cats.find((c) => c.slug === p.categorySlug)
  return (
    <section>
      <div className="wrap">
        <p className="label" style={{marginBottom: 24}}>
          <Link href={href(lang, '/shop')}>{s.label}</Link>{cat && <> / <Link href={href(lang, `/shop/${cat.slug}`)}>{cat.title}</Link></>}
        </p>
        <div className="pdp">
          <div className="gallery">
            {p.images.length ? p.images.map((im, i) => <img key={i} src={`${im.url}?w=1000&h=1000&fit=crop&auto=format`} alt={i === 0 ? p.title : ''} />) : <img src="/placeholder.jpg" alt={`${p.title}: ${s.photoSoon}`} />}
          </div>
          <div style={{display: 'grid', gap: 18}}>
            <h1 style={{fontSize: 'clamp(2rem,4vw,3rem)'}}>{p.title}</h1>
            <p className="price" style={{fontSize: '1.3rem'}}>{formatPriceL(lang, p.price)}{p.oldPrice && p.price != null && <s>{formatPriceL(lang, p.oldPrice)}</s>}</p>
            {p.maker && <p className="muted">{s.madeBy(p.maker)}</p>}
            {p.description && <p style={{maxWidth: '60ch', whiteSpace: 'pre-line'}}>{p.description}</p>}
            <AddToCart slug={p.slug} title={p.title} price={p.price} inStock={p.inStock} lang={lang} />
            <p className="muted" style={{fontSize: '.9rem'}}>{s.delivery}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
