'use client'
import Link from 'next/link'
import {useState} from 'react'
import {useCart} from '@/components/CartProvider'
import {sendLead} from '@/components/LeadForm'
import {formatPrice} from '@/lib/format'

export default function CartView({cities}: {cities: string[]}) {
  const {items, total, setQty, clear} = useCart()
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  if (state === 'ok')
    return (
      <div className="card">
        <h3>Order received</h3>
        <p className="muted">Thank you. We will message you within a day to confirm delivery and payment.</p>
        <Link className="btn ghost" href="/shop" style={{alignSelf: 'start'}}>Back to shop</Link>
      </div>
    )

  if (!items.length)
    return (
      <div className="card">
        <p className="muted">Your cart is empty.</p>
        <Link className="btn" href="/shop" style={{alignSelf: 'start'}}>Go to shop</Link>
      </div>
    )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    setState('sending')
    try {
      await sendLead({kind: 'order', ...data, items: items.map((i) => ({slug: i.slug, title: i.title, qty: i.qty, price: i.price})), total})
      clear()
      setState('ok')
    } catch {
      setState('error')
    }
  }

  return (
    <div style={{display: 'grid', gap: 40}}>
      <div>
        {items.map((i) => (
          <div className="cart-row" key={i.slug}>
            <div><Link href={`/shop/item/${i.slug}`}><b>{i.title}</b></Link><p className="muted">{formatPrice(i.price)}</p></div>
            <div className="qty">
              <button type="button" aria-label="Fewer" onClick={() => setQty(i.slug, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button type="button" aria-label="More" onClick={() => setQty(i.slug, i.qty + 1)}>+</button>
            </div>
            <span className="price">{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="total"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>

      <form className="f" onSubmit={onSubmit}>
        <h2>Delivery</h2>
        <label className="fl" htmlFor="o-name">Your name<input id="o-name" name="name" required /></label>
        <label className="fl" htmlFor="o-contact">WhatsApp, Telegram or phone<input id="o-contact" name="contact" required placeholder="+998 … or @username" /></label>
        <label className="fl" htmlFor="o-city">City<select id="o-city" name="city">{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="fl" htmlFor="o-address">Hotel or address<input id="o-address" name="address" required /></label>
        <label className="fl" htmlFor="o-note">Dates and comments<textarea id="o-note" name="note" placeholder="When are you in this city?" /></label>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <p className="muted" style={{fontSize: '.9rem'}}>No online payment yet: you pay on delivery. We confirm every order by message.</p>
        <div className="row" style={{alignItems: 'center'}}>
          <button className="btn accent" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : `Place order · ${formatPrice(total)}`}</button>
          {state === 'error' && <span className="err">Could not send the order. Please try again or message us on Instagram.</span>}
        </div>
      </form>
    </div>
  )
}
