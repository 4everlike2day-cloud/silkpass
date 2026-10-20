'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useCart} from './CartProvider'
import ThemeToggle from './ThemeToggle'
import {LANGS, LANG_LABEL, href, splitPath, t} from '@/lib/i18n'

export default function Header() {
  const pathname = usePathname() || '/'
  const {lang, path} = splitPath(pathname)
  const d = t(lang).nav
  const [open, setOpen] = useState(false)
  const {count} = useCart()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const links = [
    {href: '/', label: d.route},
    {href: '/how-it-works', label: d.how},
    {href: '/where-to-buy', label: d.buy},
    {href: '/shop', label: d.shop},
    {href: '/partners', label: d.partners},
    {href: '/faq', label: d.faq},
  ]
  const isOn = (h: string) => (h === '/' ? path === '/' : path === h || path.startsWith(h + '/'))
  const remember = (l: string) => {
    try {
      localStorage.setItem('w2uz-lang', l)
    } catch {}
  }

  return (
    <header className="site">
      <div className="wrap">
        <Link className="logo" href={href(lang, '/')}><img src="/brand/w2uz-mark.png" alt="" width={44} height={44} />Welcome 2 UZB</Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{d.menu}</button>
        <nav className={`main${open ? ' open' : ''}`} id="nav">
          {links.map((l) => (
            <Link key={l.href} href={href(lang, l.href)} aria-current={isOn(l.href) ? 'page' : undefined}>{l.label}</Link>
          ))}
          <Link href={href(lang, '/cart')} className="cart-link" aria-current={isOn('/cart') ? 'page' : undefined}>
            {d.cart}{count > 0 && <span className="count">{count}</span>}
          </Link>
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <Link
                key={l}
                href={href(l, path)}
                hrefLang={l}
                className={l === lang ? 'on' : undefined}
                aria-current={l === lang ? 'true' : undefined}
                onClick={() => remember(l)}
              >
                {LANG_LABEL[l]}
              </Link>
            ))}
          </div>
          <ThemeToggle label={t(lang).theme} />
        </nav>
      </div>
    </header>
  )
}
