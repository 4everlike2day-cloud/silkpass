import ProductCard from '@/components/ProductCard'
import CategoryNav from './CategoryNav'
import {getCategories, getProducts} from '@/lib/data'

export const metadata = {title: 'Shop'}

export default async function Shop() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  return (
    <section>
      <div className="wrap">
        <p className="label">Shop</p>
        <h1 style={{marginTop: 18, marginBottom: 28}}>Passports, covers and souvenirs</h1>
        <CategoryNav cats={cats} />
        <div style={{display: 'grid', gap: 48}}>
          {cats.map((c) => {
            const items = products.filter((p) => p.categorySlug === c.slug)
            if (!items.length) return null
            return (
              <div key={c.slug}>
                <div className="sec-head"><h2>{c.title}</h2>{c.description && <p className="muted">{c.description}</p>}</div>
                <div className="grid4">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
