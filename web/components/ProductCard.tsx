import Link from 'next/link'
import {formatPriceL, href, t, type Lang} from '@/lib/i18n'
import type {Product} from '@/lib/types'

export default function ProductCard({p, lang = 'en'}: {p: Product; lang?: Lang}) {
  const img = p.images[0]
  const s = t(lang).shop
  return (
    <Link className="card product" href={href(lang, `/shop/item/${p.slug}`)}>
      {img ? <img src={`${img.url}?w=600&h=600&fit=crop&auto=format`} alt={p.title} loading="lazy" /> : <img src="/placeholder.jpg" alt={`${p.title}: ${s.photoSoon}`} loading="lazy" />}
      <h3>{p.title}</h3>
      <p className="price">{formatPriceL(lang, p.price)}{p.oldPrice && p.price != null && <s>{formatPriceL(lang, p.oldPrice)}</s>}</p>
      {!p.inStock && <span className="badge off">{s.outOfStock}</span>}
    </Link>
  )
}
