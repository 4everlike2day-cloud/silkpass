'use client'
import Link from 'next/link'
import {useState} from 'react'
import {useCart} from './CartProvider'

export default function AddToCart({slug, title, price, inStock}: {slug: string; title: string; price: number | null; inStock: boolean}) {
  const {add, items} = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  if (price == null) return <p className="muted">Price coming soon. Message us to pre-order.</p>
  if (!inStock) return <span className="badge off">Out of stock</span>
  const inCart = items.find((i) => i.slug === slug)?.qty || 0
  return (
    <div className="row" style={{alignItems: 'center'}}>
      <div className="qty">
        <button type="button" aria-label="Fewer" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <span>{qty}</span>
        <button type="button" aria-label="More" onClick={() => setQty(qty + 1)}>+</button>
      </div>
      <button className="btn accent" type="button" onClick={() => { add({slug, title, price}, qty); setAdded(true) }}>Add to cart</button>
      {(added || inCart > 0) && <Link href="/cart">In cart: {inCart} · Checkout →</Link>}
    </div>
  )
}
