import Link from 'next/link'
import type {City, Settings} from '@/lib/types'

export default function Footer({cities, settings}: {cities: City[]; settings: Settings}) {
  return (
    <>
      <div className="flagline" aria-hidden="true" />
      <footer className="site">
        <div className="wrap">
          <div>
            <Link className="logo" href="/" style={{color: 'var(--ink)'}}><i>W2</i>Welcome 2 UZB</Link>
            <p className="muted" style={{marginTop: 12, maxWidth: '36ch'}}>
              A souvenir passport for Uzbekistan&apos;s four classic cities. A SilkPass project.
            </p>
            {settings.instagram && (
              <p style={{marginTop: 12}}>
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">Instagram @{settings.instagram}</a>
              </p>
            )}
          </div>
          <div>
            <p className="label" style={{marginBottom: 10}}>Route</p>
            {cities.map((c) => <Link key={c.slug} href={`/${c.slug}`}>{c.nameUz}</Link>)}
          </div>
          <div>
            <p className="label" style={{marginBottom: 10}}>Info</p>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/where-to-buy">Get a passport</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/partners">For partners</Link>
            <Link href="/faq">FAQ &amp; contacts</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
