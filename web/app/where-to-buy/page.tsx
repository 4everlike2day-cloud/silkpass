import Link from 'next/link'
import {formatPrice, getCities, getPartners, getSettings, pad} from '@/lib/data'

export const metadata = {title: 'Get a passport'}

export default async function WhereToBuy() {
  const [cities, partners, s] = await Promise.all([getCities(), getPartners(), getSettings()])
  const sales = partners.filter((p) => p.roles.includes('sales'))
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">Get a passport</p>
          <h1 style={{marginTop: 18, maxWidth: '14ch'}}>Where to buy</h1>
          <p className="muted" style={{marginTop: 18, maxWidth: '52ch', fontSize: '1.08rem'}}>
            Pick one up at a partner point on the route, or order online and we&apos;ll arrange delivery to your hotel.
          </p>
          <div className="row" style={{marginTop: 24, alignItems: 'center'}}>
            <span className="label">Price</span><span className="price">{formatPrice(s.passportPrice)}</span>
            <Link className="btn accent" href="/shop/passports">Order online</Link>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap grid2">
          {cities.map((c) => {
            const here = sales.filter((p) => p.citySlug === c.slug)
            return (
              <div className="card" key={c.slug}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>{c.nameUz}</h3><span className="step-n">{pad(c.order)} / {pad(cities.length)}</span>
                </div>
                {here.length === 0 ? (
                  <p className="muted">Sales points in {c.name} are coming soon.</p>
                ) : (
                  here.map((p) => (
                    <div key={p.id}>
                      <p><b>{p.name}</b>{p.kind && <span className="muted"> · {p.kind}</span>}</p>
                      {p.address && <p className="muted">{p.address}</p>}
                      {p.hours && <p className="muted">{p.hours}</p>}
                      <a href={p.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${p.name}, ${c.name}, Uzbekistan`)}`} target="_blank" rel="noopener">Open in maps</a>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </section>
      {(s.telegram || s.whatsapp) && (
        <section>
          <div className="wrap">
            <div className="card">
              <p className="label">Order by message</p><h3>WhatsApp or Telegram</h3>
              <p className="muted">Send us your hotel and travel dates. We reply within a day.</p>
              <div className="row">
                {s.whatsapp && <a className="btn ghost" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>}
                {s.telegram && <a className="btn ghost" href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener">Telegram @{s.telegram}</a>}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
