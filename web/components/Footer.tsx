'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import type {City, Settings} from '@/lib/types'
import {href, splitPath, t} from '@/lib/i18n'

export default function Footer({cities, settings}: {cities: City[]; settings: Settings}) {
  const {lang} = splitPath(usePathname() || '/')
  const d = t(lang)
  return (
    <>
      <div className="flagline" aria-hidden="true" />
      <footer className="site">
        <div className="wrap">
          <div>
            <Link href={href(lang, '/')} aria-label="Welcome 2 UZB"><img className="footer-logo" src="/brand/w2uz-logo.png" alt="Welcome 2 UZB · W2-UZ" width={140} height={160} /></Link>
            <p className="muted" style={{marginTop: 12, maxWidth: '36ch'}}>{d.footer.about}</p>
            {settings.instagram && (
              <p style={{marginTop: 12}}>
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">Instagram @{settings.instagram}</a>
              </p>
            )}
          </div>
          <div>
            <p className="label" style={{marginBottom: 10}}>{d.footer.route}</p>
            {cities.map((c) => <Link key={c.slug} href={href(lang, `/${c.slug}`)}>{c.nameUz}</Link>)}
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
      </footer>
    </>
  )
}
