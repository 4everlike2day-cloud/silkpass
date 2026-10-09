import Link from 'next/link'
import {notFound} from 'next/navigation'
import AddToCart from '@/components/AddToCart'
import {formatPrice, getCategories, getProducts} from '@/lib/data'

export const dynamicParams = false
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({slug: p.slug}))
}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const p = (await getProducts()).find((x) => x.slug === slug)
  return p ? {title: p.title, description: p.description || undefined} : {}
}

export default async function ProductPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [products, cats] = await Promise.all([getProducts(), getCategories()])
  const p = products.find((x) => x.slug === slug)
  if (!p) notFound()
  const cat = cats.find((c) => c.slug === p.categorySlug)
  return (
    <section>
      <div className="wrap">
        <p className="label" style={{marginBottom: 24}}>
          <Link href="/shop">Shop</Link>{cat && <> / <Link href={`/shop/${cat.slug}`}>{cat.title}</Link></>}
        </p>
        <div className="pdp">
          <div className="gallery">
            {p.images.length ? p.images.map((im, i) => <img key={i} src={`${im.url}?w=1000&h=1000&fit=crop&auto=format`} alt={i === 0 ? p.title : ''} />) : <div className="ph-img">Photo</div>}
          </div>
          <div style={{display: 'grid', gap: 18}}>
            <h1 style={{fontSize: 'clamp(2rem,4vw,3rem)'}}>{p.title}</h1>
            <p className="price" style={{fontSize: '1.3rem'}}>{formatPrice(p.price)}{p.oldPrice && p.price != null && <s>{formatPrice(p.oldPrice)}</s>}</p>
            {p.maker && <p className="muted">Made by {p.maker}</p>}
            {p.description && <p style={{maxWidth: '60ch', whiteSpace: 'pre-line'}}>{p.description}</p>}
            <AddToCart slug={p.slug} title={p.title} price={p.price} inStock={p.inStock} />
            <p className="muted" style={{fontSize: '.9rem'}}>Delivery to your hotel in Tashkent, Samarkand, Bukhara or Khiva, or pick up at a partner point. Payment on delivery.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
