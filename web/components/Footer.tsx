import Link from 'next/link'
import type {City, Settings} from '@/lib/types'

export default function Footer({cities, settings}: {cities: City[]; settings: Settings}) {
  return (
    <>
      <div className="flagline" aria-hidden="true" />
      <footer className="site">
        <div className="wrap">
          <div>
            <Link href="/" aria-label="Welcome 2 UZB"><img className="footer-logo" src="/brand/w2uz-logo.png" alt="Welcome 2 UZB · W2-UZ" width={140} height={160} /></Link>
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
            <Link href="/reward">Reward</Link>
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
