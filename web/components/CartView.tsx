'use client'
import Link from 'next/link'
import {useState} from 'react'
import {useCart} from '@/components/CartProvider'
import {sendLead} from '@/components/LeadForm'
import {formatPriceL, href, t, type Lang} from '@/lib/i18n'

export default function CartView({cities, lang = 'en'}: {cities: string[]; lang?: Lang}) {
  const c = t(lang).cart
  const formatPrice = (n: number | null) => formatPriceL(lang, n)
  const {items, total, setQty, clear} = useCart()
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  if (state === 'ok')
    return (
      <div className="card">
        <h3>{c.received}</h3>
        <p className="muted">{c.receivedText}</p>
        <Link className="btn ghost" href={href(lang, '/shop')} style={{alignSelf: 'start'}}>{c.back}</Link>
      </div>
    )

  if (!items.length)
    return (
      <div className="card">
        <p className="muted">{c.empty}</p>
        <Link className="btn" href={href(lang, '/shop')} style={{alignSelf: 'start'}}>{c.go}</Link>
      </div>
    )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    setState('sending')
    try {
      await sendLead({kind: 'order', lang, ...data, items: items.map((i) => ({slug: i.slug, title: i.title, qty: i.qty, price: i.price})), total})
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
            <div><Link href={href(lang, `/shop/item/${i.slug}`)}><b>{i.title}</b></Link><p className="muted">{formatPrice(i.price)}</p></div>
            <div className="qty">
              <button type="button" aria-label={t(lang).shop.fewer} onClick={() => setQty(i.slug, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button type="button" aria-label={t(lang).shop.more} onClick={() => setQty(i.slug, i.qty + 1)}>+</button>
            </div>
            <span className="price">{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="total"><span>{c.total}</span><span>{formatPrice(total)}</span></div>
      </div>

      <form className="f" onSubmit={onSubmit}>
        <h2>{c.delivery}</h2>
        <label className="fl" htmlFor="o-name">{c.name}<input id="o-name" name="name" required /></label>
        <label className="fl" htmlFor="o-contact">{c.contact}<input id="o-contact" name="contact" required placeholder={c.contactPh} /></label>
        <label className="fl" htmlFor="o-city">{c.city}<select id="o-city" name="city">{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="fl" htmlFor="o-address">{c.address}<input id="o-address" name="address" required /></label>
        <label className="fl" htmlFor="o-note">{c.note}<textarea id="o-note" name="note" placeholder={c.notePh} /></label>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <p className="muted" style={{fontSize: '.9rem'}}>{c.payNote}</p>
        <div className="row" style={{alignItems: 'center'}}>
          <button className="btn accent" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t(lang).sending : c.place(formatPrice(total))}</button>
          {state === 'error' && <span className="err">{c.error}</span>}
        </div>
      </form>
    </div>
  )
}
