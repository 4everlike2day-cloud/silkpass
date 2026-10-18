'use client'
import Link from 'next/link'
import {useState} from 'react'
import {useCart} from './CartProvider'
import {href, t, type Lang} from '@/lib/i18n'

export default function AddToCart({slug, title, price, inStock, lang = 'en'}: {slug: string; title: string; price: number | null; inStock: boolean; lang?: Lang}) {
  const {add, items} = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const s = t(lang).shop
  if (price == null) return <p className="muted">{s.priceSoonPre}</p>
  if (!inStock) return <span className="badge off">{s.outOfStock}</span>
  const inCart = items.find((i) => i.slug === slug)?.qty || 0
  return (
    <div className="row" style={{alignItems: 'center'}}>
      <div className="qty">
        <button type="button" aria-label={s.fewer} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <span>{qty}</span>
        <button type="button" aria-label={s.more} onClick={() => setQty(qty + 1)}>+</button>
      </div>
      <button className="btn accent" type="button" onClick={() => { add({slug, title, price}, qty); setAdded(true) }}>{s.add}</button>
      {(added || inCart > 0) && <Link href={href(lang, '/cart')}>{s.inCart(inCart)}</Link>}
    </div>
  )
}
