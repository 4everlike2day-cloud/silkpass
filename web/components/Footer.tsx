'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import type {ReactNode} from 'react'
import type {City, Settings} from '@/lib/types'
import {href, splitPath, t, type Lang} from '@/lib/i18n'

// Иконки соцсетей: простые контурные значки в цвете текста.
const ICON: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11l6 2.2M21 4l-3 16-6.5-5.3M21 4 9 13.2m0 0V19l2.5-4.3" /></svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-3.8A8.5 8.5 0 1 1 8 19z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.8-2.8l.8-1-1-2z" /></svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>
  ),
}

export default function Footer({cities, settings}: {cities: Record<Lang, City[]>; settings: Settings}) {
  const {lang} = splitPath(usePathname() || '/')
  const d = t(lang)
  const email = settings.email || 'hello@silkpass.uz'
  const social = [
    settings.instagram && {key: 'instagram', label: 'Instagram', url: `https://instagram.com/${settings.instagram}`},
    settings.telegram && {key: 'telegram', label: 'Telegram', url: `https://t.me/${settings.telegram}`},
    settings.whatsapp && {key: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${settings.whatsapp}`},
    {key: 'email', label: email, url: `mailto:${email}`},
  ].filter(Boolean) as {key: string; label: string; url: string}[]
  return (
    <>
      <div className="flagline" aria-hidden="true" />
      <footer className="site">
        <div className="wrap">
          <div className="footer-main">
            <div>
              <Link href={href(lang, '/')} aria-label="Welcome 2 UZB" className="footer-logo-link">
                <img className="footer-logo" src="/brand/w2uz-logo.png" alt="Welcome 2 UZB · W2-UZ" width={64} height={73} />
              </Link>
              <div className="social">
                {social.map((s) => (
                  <a key={s.key} href={s.url} target={s.key === 'email' ? undefined : '_blank'} rel="noopener" aria-label={s.label} title={s.label}>
                    {ICON[s.key]}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="label" style={{marginBottom: 10}}>{d.footer.route}</p>
              {(cities[lang] || cities.en).map((c) => <Link key={c.slug} href={href(lang, `/${c.slug}`)}>{c.name}</Link>)}
            </div>
            <div>
              <p className="label" style={{marginBottom: 10}}>{d.footer.info}</p>
              <Link href={href(lang, '/how-it-works')}>{d.nav.how}</Link>
              <Link href={href(lang, '/reward')}>{d.nav.reward}</Link>
              <Link href={href(lang, '/where-to-buy')}>{d.nav.buy}</Link>
              <Link href={href(lang, '/shop')}>{d.nav.shop}</Link>
              <Link href={href(lang, '/partners')}>{d.nav.partners}</Link>
              <Link href={href(lang, '/faq')}>{d.nav.faqFull}</Link>
            </div>
          </div>
          <p className="copyright">© {new Date().getFullYear()} SilkPass</p>
        </div>
      </footer>
    </>
  )
}
