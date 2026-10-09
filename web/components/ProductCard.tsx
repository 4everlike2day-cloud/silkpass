import Link from 'next/link'
import {formatPrice} from '@/lib/format'
import type {Product} from '@/lib/types'

export default function ProductCard({p}: {p: Product}) {
  const img = p.images[0]
  return (
    <Link className="card product" href={`/shop/item/${p.slug}`}>
      {img ? <img src={`${img.url}?w=600&h=600&fit=crop&auto=format`} alt={p.title} loading="lazy" /> : <div className="ph-img">Photo</div>}
      <h3>{p.title}</h3>
      <p className="price">{formatPrice(p.price)}{p.oldPrice && p.price != null && <s>{formatPrice(p.oldPrice)}</s>}</p>
      {!p.inStock && <span className="badge off">Out of stock</span>}
    </Link>
  )
}
