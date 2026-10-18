import Link from 'next/link'
import Stamp from '@/components/Stamp'
import ProductCard from '@/components/ProductCard'
import {getCities, getPartners, getProducts, getSettings, pad} from '@/lib/data'
import {href, t, type Lang} from '@/lib/i18n'

export default async function Home({lang}: {lang: Lang}) {
  const d = t(lang)
  const h = d.home
  const [cities, settings, partners, products] = await Promise.all([getCities(lang), getSettings(lang), getPartners(lang), getProducts(lang)])
  const featured = products.filter((p) => p.featured).slice(0, 4)
  const logos = partners.filter((p) => p.logo)
  const total = cities.length
  return (
    <>
      <section>
        <div className="wrap hero">
          <div>
            <p className="label">{h.label}</p>
            <h1 style={{marginTop: 18}}>{settings.heroTitle}</h1>
            <p className="lede">{settings.heroLede}</p>
            <div className="row">
              <Link className="btn" href={href(lang, '/where-to-buy')}>{h.getPassport}</Link>
              <Link className="btn ghost" href={href(lang, '/how-it-works')}>{h.how}</Link>
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
            <div><p className="label">{h.routeLabel}</p><h2 style={{marginTop: 12}}>{h.routeTitle(total)}</h2></div>
            <p className="muted">{h.routeNote}</p>
          </div>
          <div className="grid4">
            {cities.map((c) => (
              <Link key={c.slug} className="card city-card" href={href(lang, `/${c.slug}`)}>
                <div className="top"><span className="step-n">{pad(c.order)} / {pad(total)}</span><Stamp {...c} size={64} total={total} /></div>
                <h3>{c.nameUz}</h3>
                <p className="muted">{c.name}</p>
                {c.places.length > 1 && <p style={{fontSize: '.92rem'}}>{h.andMore(c.places[0].title, c.places[1].title)}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><p className="label">{h.howLabel}</p><h2 style={{marginTop: 12}}>{h.howTitle}</h2></div>
            <Link className="btn ghost" href={href(lang, '/how-it-works')}>{h.fullRules}</Link>
          </div>
          <div className="grid3">
            <div className="card"><span className="step-n">{h.step(1)}</span><h3>{h.s1t}</h3><p className="muted">{h.s1d}</p></div>
            <div className="card"><span className="step-n">{h.step(2)}</span><h3>{h.s2t}</h3><p className="muted">{h.s2d}</p></div>
            <div className="card"><span className="step-n">{h.step(3)}</span><h3>{h.s3t}</h3><p className="muted">{h.s3d(settings.hashtag, total)}</p></div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head">
              <div><p className="label">{h.shopLabel}</p><h2 style={{marginTop: 12}}>{h.shopTitle}</h2></div>
              <Link className="btn ghost" href={href(lang, '/shop')}>{h.allProducts}</Link>
            </div>
            <div className="grid4">{featured.map((p) => <ProductCard key={p.slug} p={p} lang={lang} />)}</div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div><p className="label">{h.partnersLabel}</p><h2 style={{marginTop: 12}}>{h.partnersTitle}</h2></div>
            <Link className="btn ghost" href={href(lang, '/partners')}>{h.becomePartner}</Link>
          </div>
          {logos.length > 0 ? (
            <div className="logos">{logos.map((p) => <img key={p.id} src={`${p.logo!.url}?h=96&auto=format`} alt={p.name} />)}</div>
          ) : (
            <p className="muted">{h.partnersSoon}</p>
          )}
        </div>
      </section>
    </>
  )
}
