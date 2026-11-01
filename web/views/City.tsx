import Link from 'next/link'
import {notFound} from 'next/navigation'
import Stamp from '@/components/Stamp'
import {getAds, getCities, getCity, getDeals, getGuides, getPartners, pad} from '@/lib/data'
import {guideTips} from '@/lib/guideTips'
import {events, wikiUrl} from '@/lib/cityLinks'
import {href, t, type Lang} from '@/lib/i18n'
import {getPlaces, placesEnabled} from '@/lib/places'

// Адреса городов (/tashkent, /samarkand…) зашиты в QR-кодах паспорта. Не переименовывайте их после печати.
export const cityParams = async () => (await getCities()).map((c) => ({city: c.slug}))
export async function cityMeta(lang: Lang, slug: string) {
  const c = await getCity(slug, lang)
  return c ? {title: `${c.nameUz} · ${c.name}`, description: c.intro} : {}
}

export default async function CityPage({lang, slug}: {lang: Lang; slug: string}) {
  const d = t(lang).city
  const [c, cities, partners, deals, ads, allGuides] = await Promise.all([getCity(slug, lang), getCities(lang), getPartners(lang), getDeals(lang), getAds(lang), getGuides(lang)])
  if (!c) notFound()
  const total = cities.length
  const idx = cities.findIndex((x) => x.slug === c.slug)
  const next = cities[idx + 1] || null
  const stampPoints = partners.filter((p) => p.citySlug === c.slug && p.roles.includes('stamp'))
  const cityDeals = deals.filter((d) => d.citySlug === c.slug)
  const ad = ads.find((a) => a.citySlug === c.slug)
  const guides = allGuides.filter((g) => g.citySlug === c.slug)
  const ev = events(c, lang)
  const gt = guideTips(c.slug, lang)
  const openMap = t(lang).guide.openMap
  const showPlaces = placesEnabled(c.slug)
  const placesCount = showPlaces ? (await getPlaces(c.slug)).length : 0
  const PT = {
    en: {label: 'What to see', title: (n: number) => (n ? `${n} places worth your time` : 'Places worth your time'), text: "By category, with a rating from travellers' votes.", btn: 'Open the list'},
    ru: {label: 'Что посмотреть', title: (n: number) => (n ? `${n} мест, которые стоит увидеть` : 'Места, которые стоит увидеть'), text: 'По категориям, с рейтингом по голосам путешественников.', btn: 'Открыть список'},
    uz: {label: "Nimani ko'rish kerak", title: (n: number) => (n ? `Ko'rishga arziydigan ${n} ta joy` : "Ko'rishga arziydigan joylar"), text: "Toifalar bo'yicha, sayohatchilar ovozlari asosidagi reyting bilan.", btn: "Ro'yxatni ochish"},
  }[lang]

  return (
    <>
      <section>
        <div className="wrap city-hero">
          <div>
            <p className="label">{d.stop(pad(c.order), pad(total))}</p>
            <h1 style={{marginTop: 16}}>{c.nameUz}</h1>
            <p className="en muted">{c.name} · <a href={wikiUrl(c, lang)} target="_blank" rel="noopener">{d.wiki} ↗</a></p>
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
                <p className="label">{d.getStamp}</p>
                <h2 style={{marginTop: 12}}>{d.stampPoint}</h2>
                <p className="muted" style={{marginTop: 12}}>{d.settingUp(c.name)}</p>
              </div>
              <div className="side"><p>{d.howStamp(c.name)}</p></div>
            </div>
          ) : (
            stampPoints.map((p) => (
              <div className="stamp-point" key={p.id}>
                <div>
                  <p className="label">{d.getStamp}</p>
                  <h2 style={{marginTop: 12}}>{p.name}</h2>
                  <dl className="kv">
                    {p.kind && <><dt>{d.place}</dt><dd>{p.kind}</dd></>}
                    {p.address && <><dt>{d.address}</dt><dd>{p.address}</dd></>}
                    {p.hours && <><dt>{d.hours}</dt><dd>{p.hours}</dd></>}
                  </dl>
                </div>
                <div className="side">
                  <p>{d.howStamp(c.name)}</p>
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

      {showPlaces && (
        <section style={{paddingTop: 0, borderTop: 0}}>
          <div className="wrap">
            <Link className="pl-cta" href={href(lang, `/${c.slug}/places`)}>
              <div>
                <p className="label">{PT.label}</p>
                <h2 style={{marginTop: 10}}>{PT.title(placesCount)}</h2>
                <p className="muted" style={{marginTop: 8}}>{PT.text}</p>
              </div>
              <span className="btn">{PT.btn} →</span>
            </Link>
          </div>
        </section>
      )}

      {c.places.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head"><div><p className="label">{d.dontMiss}</p><h2 style={{marginTop: 12}}>{d.topPlaces(c.name)}</h2></div></div>
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

      {gt && (
        <section>
          <div className="wrap">
            <div className="gtips">
              <div className="gtips-head">
                <div>
                  <span className="gtips-badge">★ {gt.label}</span>
                  <h2>{gt.title}</h2>
                  <p className="muted">{gt.intro}</p>
                </div>
                <div className="gtips-guide">
                  <a className="gtips-card" href={gt.guide.url} target="_blank" rel="noopener">
                    <span className="ava" aria-hidden="true">{gt.guide.name.charAt(0)}</span>
                    <span className="who"><b>{gt.guide.name} · @{gt.guide.handle}</b><small>{gt.guide.role}</small><em>{gt.guide.cta} ↗</em></span>
                  </a>
                  <span className="gtips-links">{gt.guide.links.map((l) => <a key={l.label} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</span>
                </div>
              </div>
              <ol className="gtips-list">
                {gt.tips.map((x, i) => (
                  <li key={i}>
                    <span className="n">{pad(i + 1)}</span>
                    <div><h3>{x.title}</h3><p className="muted">{x.text}</p>
                      <a className="btn ghost sm" href={x.mapsUrl} target="_blank" rel="noopener">{openMap} ↗</a></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap grid2">
          <div className="card">
            <p className="label">{d.eat}</p><h3>{d.flavours}</h3>
            <ul style={{margin: 0, paddingLeft: 18, display: 'grid', gap: 6}}>{c.food.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
          <div className="card">
            <p className="label">{d.deals}</p><h3>{d.dealsTitle}</h3>
            {cityDeals.length > 0 ? (
              <ul style={{margin: 0, paddingLeft: 18, display: 'grid', gap: 6}}>
                {cityDeals.map((d, i) => <li key={i}><b>{d.partnerName}</b> · {d.text}</li>)}
              </ul>
            ) : (
              <p className="muted">{d.dealsSoon} <Link href={href(lang, '/partners')}>{d.offerDeal}</Link></p>
            )}
          </div>
        </div>
      </section>


      {(guides.length > 0 || ev) && (
        <section>
          <div className="wrap">
            <div className="sec-head"><div><p className="label">{d.more(c.name)}</p><h2 style={{marginTop: 12}}>{d.beyond}</h2></div></div>
            <div className="more-grid">
              {guides.map((g) => (
                <Link key={g.slug} className="more-card" href={href(lang, `/${c.slug}/${g.slug}`)}>
                  {g.cover && <img src={`${g.cover.url}?w=640&h=400&fit=crop&auto=format`} alt="" loading="lazy" />}
                  <div><h3>{g.title}</h3>{g.summary && <p className="muted">{g.summary}</p>}<span className="go">{d.open} →</span></div>
                </Link>
              ))}
              {ev && (
                <a className="more-card" href={ev.url} target="_blank" rel="noopener">
                  {ev.image && <img src={ev.image} alt="" loading="lazy" />}
                  <div><p className="label">{d.events}</p><h3>{d.whatsOn(c.name)}</h3><p className="muted">{ev.label}</p><span className="go">{d.open} ↗</span></div>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {ad && (
        <section>
          <div className="wrap">
            <a className="ad" href={ad.url || '#'} target={ad.url ? '_blank' : undefined} rel="noopener sponsored" style={{textDecoration: 'none'}}>
              <div><p className="label">{d.sponsored}</p><h3 style={{marginTop: 8}}>{ad.title}</h3>{ad.text && <p className="muted" style={{marginTop: 6}}>{ad.text}</p>}</div>
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
                  <p className="label">{d.next}</p>
                  <h2>{next.nameUz} →</h2>
                  {c.nextTravel && <p className="travel">{c.nextTravel}</p>}
                  <div className="progress">{cities.map((x) => <span key={x.slug} className={x.order <= c.order ? 'done' : ''} />)}</div>
                </div>
                <Link className="btn" href={href(lang, `/${next.slug}`)}>{d.goTo(next.name)}</Link>
              </>
            ) : (
              <>
                <div>
                  <p className="label">{d.final}</p>
                  <h2>{d.complete}</h2>
                  <p className="travel">{d.finalText}</p>
                  <div className="progress">{cities.map((x) => <span key={x.slug} className="done" />)}</div>
                </div>
                <Link className="btn" href={href(lang, '/reward')}>{d.claim}</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
