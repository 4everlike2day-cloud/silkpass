import Link from 'next/link'
import Stamp from '@/components/Stamp'
import ProductCard from '@/components/ProductCard'
import {getCities, getPartners, getProducts, getSettings, pad} from '@/lib/data'

export default async function Home() {
  const [cities, settings, partners, products] = await Promise.all([getCities(), getSettings(), getPartners(), getProducts()])
  const featured = products.filter((p) => p.featured).slice(0, 4)
  const logos = partners.filter((p) => p.logo)
  const total = cities.length
  return (
    <>
      <section>
        <div className="wrap hero">
          <div>
            <p className="label">Souvenir passport · W2-UZ</p>
            <h1 style={{marginTop: 18}}>{settings.heroTitle}</h1>
            <p className="lede">{settings.heroLede}</p>
            <div className="row">
              <Link className="btn" href="/where-to-buy">Get a passport</Link>
              <Link className="btn ghost" href="/how-it-works">How it works</Link>
            </div>
          </div>
          <div className="passport" aria-hidden="true">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span className="label">Welcome 2 UZB</span><span className="label">№ 000127</span>
            </div>
            <div className="grid">{cities.map((c) => <Stamp key={c.slug} {...c} size={118} total={total} />)}</div>
            <div className="mrz">
              P&lt;W2UZ&lt;&lt;{cities.map((c) => c.nameUz.toUpperCase()).join('<')}&lt;&lt;&lt;<br />
              000127&lt;4UZB&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{pad(total)}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><p className="label">The route</p><h2 style={{marginTop: 12}}>{total} cities, {total} stamps</h2></div>
            <p className="muted">Most visitors travel west from Tashkent to Khiva. Each city has its own stamp designed around its landmark.</p>
          </div>
          <div className="grid4">
            {cities.map((c) => (
              <Link key={c.slug} className="card city-card" href={`/${c.slug}`}>
                <div className="top"><span className="step-n">{pad(c.order)} / {pad(total)}</span><Stamp {...c} size={64} total={total} /></div>
                <h3>{c.nameUz}</h3>
                <p className="muted">{c.name}</p>
                {c.places.length > 1 && <p style={{fontSize: '.92rem'}}>{c.places[0].title}, {c.places[1].title} and more</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><p className="label">How it works</p><h2 style={{marginTop: 12}}>Three steps</h2></div>
            <Link className="btn ghost" href="/how-it-works">Full rules</Link>
          </div>
          <div className="grid3">
            <div className="card"><span className="step-n">Step 1</span><h3>Get your passport</h3><p className="muted">Buy it at a partner hostel, hotel or tour agency on the route, or order it online.</p></div>
            <div className="card"><span className="step-n">Step 2</span><h3>Find the stamp point</h3><p className="muted">Scan the QR code on each city page. It shows where the stamp is, opening hours and what to see nearby.</p></div>
            <div className="card"><span className="step-n">Step 3</span><h3>Stamp, date, share</h3><p className="muted">Add the date by hand, then post your passport with <b>{settings.hashtag}</b>. Collect all {total} for a reward.</p></div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head">
              <div><p className="label">Shop</p><h2 style={{marginTop: 12}}>Take more of the trip home</h2></div>
              <Link className="btn ghost" href="/shop">All products</Link>
            </div>
            <div className="grid4">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><p className="label">Partners</p><h2 style={{marginTop: 12}}>Where the stamps live</h2></div>
            <Link className="btn ghost" href="/partners">Become a partner</Link>
          </div>
          {logos.length > 0 ? (
            <div className="logos">{logos.map((p) => <img key={p.id} src={`${p.logo!.url}?h=96&auto=format`} alt={p.name} />)}</div>
          ) : (
            <p className="muted">Our first partners in Tashkent, Samarkand, Bukhara and Khiva will appear here.</p>
          )}
        </div>
      </section>
    </>
  )
}
