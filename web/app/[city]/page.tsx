import Link from 'next/link'
import {notFound} from 'next/navigation'
import Stamp from '@/components/Stamp'
import {getAds, getCities, getCity, getDeals, getPartners, pad} from '@/lib/data'

// Адреса городов (/tashkent, /samarkand…) зашиты в QR-кодах паспорта. Не переименовывайте их после печати.
export const dynamicParams = false
export async function generateStaticParams() {
  return (await getCities()).map((c) => ({city: c.slug}))
}
export async function generateMetadata({params}: {params: Promise<{city: string}>}) {
  const c = await getCity((await params).city)
  return c ? {title: `${c.nameUz} · ${c.name}`, description: c.intro} : {}
}

export default async function CityPage({params}: {params: Promise<{city: string}>}) {
  const {city: slug} = await params
  const [c, cities, partners, deals, ads] = await Promise.all([getCity(slug), getCities(), getPartners(), getDeals(), getAds()])
  if (!c) notFound()
  const total = cities.length
  const idx = cities.findIndex((x) => x.slug === c.slug)
  const next = cities[idx + 1] || null
  const stampPoints = partners.filter((p) => p.citySlug === c.slug && p.roles.includes('stamp'))
  const cityDeals = deals.filter((d) => d.citySlug === c.slug)
  const ad = ads.find((a) => a.citySlug === c.slug)

  return (
    <>
      <section>
        <div className="wrap city-hero">
          <div>
            <p className="label">Stop {pad(c.order)} of {pad(total)} · W2-UZ</p>
            <h1 style={{marginTop: 16}}>{c.nameUz}</h1>
            <p className="en muted">{c.name}</p>
            <p style={{marginTop: 22, maxWidth: '56ch', fontSize: '1.08rem'}}>{c.intro}</p>
          </div>
          <Stamp {...c} size={200} total={total} />
        </div>
        {c.image && <div className="wrap"><img className="hero-img" src={`${c.image.url}?w=1600&h=900&fit=crop&auto=format`} alt={c.name} /></div>}
      </section>

      <section style={{paddingTop: 0, borderTop: 0}}>
        <div className="wrap" style={{display: 'grid', gap: 16}}>
          {stampPoints.length === 0 ? (
            <div className="stamp-point">
              <div>
                <p className="label">Get your stamp here</p>
                <h2 style={{marginTop: 12}}>Stamp point</h2>
                <p className="muted" style={{marginTop: 12}}>The stamp point in {c.name} is being set up. Check back soon or message us.</p>
              </div>
              <div className="side"><p>Show your passport to the staff. They stamp the {c.name} page and you add the date.</p></div>
            </div>
          ) : (
            stampPoints.map((p) => (
              <div className="stamp-point" key={p.id}>
                <div>
                  <p className="label">Get your stamp here</p>
                  <h2 style={{marginTop: 12}}>{p.name}</h2>
                  <dl className="kv">
                    {p.kind && <><dt>Place</dt><dd>{p.kind}</dd></>}
                    {p.address && <><dt>Address</dt><dd>{p.address}</dd></>}
                    {p.hours && <><dt>Hours</dt><dd>{p.hours}</dd></>}
                  </dl>
                </div>
                <div className="side">
                  <p>Show your passport to the staff. They stamp the {c.name} page and you add the date.</p>
                  <div className="row">
                    <a className="btn accent" href={p.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${p.name}, ${c.name}, Uzbekistan`)}`} target="_blank" rel="noopener">Google Maps</a>
                    {p.yandexUrl && <a className="btn ghost" href={p.yandexUrl} target="_blank" rel="noopener">Yandex Maps</a>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {c.places.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head"><div><p className="label">Don&apos;t miss</p><h2 style={{marginTop: 12}}>Top places in {c.name}</h2></div></div>
            <ol className="places">
              {c.places.map((p, i) => (
                <li key={i}>
                  <span className="n">{pad(i + 1)}</span>
                  <div>
                    <h3>{p.mapsUrl ? <a href={p.mapsUrl} target="_blank" rel="noopener">{p.title}</a> : p.title}</h3>
                    <p className="muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section>
        <div className="wrap grid2">
          <div className="card">
            <p className="label">Eat &amp; try</p><h3>Local flavours</h3>
            <ul style={{margin: 0, paddingLeft: 18, display: 'grid', gap: 6}}>{c.food.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
          <div className="card">
            <p className="label">Passport holder deals</p><h3>Show your passport, save</h3>
            {cityDeals.length > 0 ? (
              <ul style={{margin: 0, paddingLeft: 18, display: 'grid', gap: 6}}>
                {cityDeals.map((d, i) => <li key={i}><b>{d.partnerName}</b> · {d.text}</li>)}
              </ul>
            ) : (
              <p className="muted">Deals from local cafes and shops are coming soon. <Link href="/partners">Offer a deal</Link></p>
            )}
          </div>
        </div>
      </section>

      {ad && (
        <section>
          <div className="wrap">
            <a className="ad" href={ad.url || '#'} target={ad.url ? '_blank' : undefined} rel="noopener sponsored" style={{textDecoration: 'none'}}>
              <div><p className="label">Sponsored</p><h3 style={{marginTop: 8}}>{ad.title}</h3>{ad.text && <p className="muted" style={{marginTop: 6}}>{ad.text}</p>}</div>
              {ad.image && <img src={`${ad.image.url}?h=160&auto=format`} alt="" style={{height: 80, width: 'auto', borderRadius: 10}} />}
            </a>
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <div className="next">
            {next ? (
              <>
                <div>
                  <p className="label">Next stop</p>
                  <h2>{next.nameUz} →</h2>
                  {c.nextTravel && <p className="travel">{c.nextTravel}</p>}
                  <div className="progress">{cities.map((x) => <span key={x.slug} className={x.order <= c.order ? 'done' : ''} />)}</div>
                </div>
                <Link className="btn" href={`/${next.slug}`}>Go to {next.name}</Link>
              </>
            ) : (
              <>
                <div>
                  <p className="label">Final stamp</p>
                  <h2>Route complete</h2>
                  <p className="travel">Show your full passport at the {c.name} stamp point to claim your reward.</p>
                  <div className="progress">{cities.map((x) => <span key={x.slug} className="done" />)}</div>
                </div>
                <Link className="btn" href="/how-it-works">Claim your reward</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
