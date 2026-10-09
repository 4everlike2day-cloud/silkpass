'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useCart} from './CartProvider'

const LINKS = [
  {href: '/', label: 'Route'},
  {href: '/how-it-works', label: 'How it works'},
  {href: '/where-to-buy', label: 'Get a passport'},
  {href: '/shop', label: 'Shop'},
  {href: '/partners', label: 'For partners'},
  {href: '/faq', label: 'FAQ'},
]

export default function Header() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const {count} = useCart()
  useEffect(() => setOpen(false), [path])
  const isOn = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'))

  return (
    <header className="site">
      <div className="wrap">
        <Link className="logo" href="/"><i>W2</i>Welcome 2 UZB</Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>Menu</button>
        <nav className={`main${open ? ' open' : ''}`} id="nav">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isOn(l.href) ? 'page' : undefined}>{l.label}</Link>
          ))}
          <Link href="/cart" className="cart-link" aria-current={isOn('/cart') ? 'page' : undefined}>
            Cart{count > 0 && <span className="count">{count}</span>}
          </Link>
          <div className="lang" title="Russian and Uzbek are coming soon">
            <span className="on">EN</span><span className="soon">RU</span><span className="soon">UZ</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
