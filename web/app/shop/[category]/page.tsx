import {notFound} from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import CategoryNav from '../CategoryNav'
import {getCategories, getProducts} from '@/lib/data'

export const dynamicParams = false
export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({category: c.slug}))
}
export async function generateMetadata({params}: {params: Promise<{category: string}>}) {
  const {category} = await params
  const c = (await getCategories()).find((x) => x.slug === category)
  return c ? {title: `${c.title} · Shop`} : {}
}

export default async function CategoryPage({params}: {params: Promise<{category: string}>}) {
  const {category} = await params
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  const cat = cats.find((c) => c.slug === category)
  if (!cat) notFound()
  const items = products.filter((p) => p.categorySlug === cat.slug)
  return (
    <section>
      <div className="wrap">
        <p className="label">Shop</p>
        <h1 style={{marginTop: 18, marginBottom: 12}}>{cat.title}</h1>
        {cat.description && <p className="muted" style={{marginBottom: 28, maxWidth: '56ch'}}>{cat.description}</p>}
        <CategoryNav cats={cats} current={cat.slug} />
        {items.length ? <div className="grid4">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div> : <p className="muted">New products are coming soon.</p>}
      </div>
    </section>
  )
}
