import Link from 'next/link'
import {getCities, getPartners, getSettings, pad} from '@/lib/data'
import {formatPriceL, href, t, type Lang} from '@/lib/i18n'

export const buyMeta = (lang: Lang) => ({title: t(lang).buy.label})

export default async function WhereToBuy({lang}: {lang: Lang}) {
  const d = t(lang)
  const b = d.buy
  const [cities, partners, s] = await Promise.all([getCities(lang), getPartners(lang), getSettings(lang)])
  const sales = partners.filter((p) => p.roles.includes('sales'))
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">{b.label}</p>
          <h1 style={{marginTop: 18, maxWidth: '14ch'}}>{b.title}</h1>
          <p className="muted" style={{marginTop: 18, maxWidth: '52ch', fontSize: '1.08rem'}}>{b.lede}</p>
          <div className="row" style={{marginTop: 24, alignItems: 'center'}}>
            <span className="label">{b.price}</span><span className="price">{formatPriceL(lang, s.passportPrice)}</span>
            <Link className="btn accent" href={href(lang, '/shop/passports')}>{b.order}</Link>
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
                  <p className="muted">{b.soon(c.name)}</p>
                ) : (
                  here.map((p) => (
                    <div key={p.id}>
                      <p><b>{p.name}</b>{p.kind && <span className="muted"> · {p.kind}</span>}</p>
                      {p.address && <p className="muted">{p.address}</p>}
                      {p.hours && <p className="muted">{p.hours}</p>}
                      <a href={p.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${p.name}, ${c.name}, Uzbekistan`)}`} target="_blank" rel="noopener">{d.openMaps}</a>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </section>
      {(s.telegram || s.whatsapp || s.instagram) && (
        <section>
          <div className="wrap">
            <div className="card">
              <p className="label">{b.byMsg}</p><h3>{b.byMsgTitle}</h3>
              <p className="muted">{b.byMsgText}</p>
              <div className="row">
                {s.whatsapp && <a className="btn ghost" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>}
                {s.telegram && <a className="btn ghost" href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener">Telegram @{s.telegram}</a>}
                {s.instagram && <a className="btn ghost" href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener">Instagram @{s.instagram}</a>}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
