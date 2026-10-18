import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getCities, getGuides, pad} from '@/lib/data'
import GuideMap from '@/components/GuideMap'

// Подборки по городам: welcome2.uz/<город>/<подборка>. Создаются в Sanity, тип «Подборка».
export const dynamicParams = false
export async function generateStaticParams() {
  const guides = await getGuides()
  // Статическому экспорту нужен хотя бы один адрес; пока подборок нет, отдаём служебную заглушку.
  if (guides.length === 0) return [{city: '_', guide: '_'}]
  return guides.map((g) => ({city: g.citySlug, guide: g.slug}))
}
export async function generateMetadata({params}: {params: Promise<{city: string; guide: string}>}) {
  const {city, guide} = await params
  const g = (await getGuides()).find((x) => x.citySlug === city && x.slug === guide)
  return g ? {title: g.title, description: g.summary || undefined} : {robots: {index: false}}
}

export default async function GuidePage({params}: {params: Promise<{city: string; guide: string}>}) {
  const {city: citySlug, guide: slug} = await params
  const [guides, cities] = await Promise.all([getGuides(), getCities()])
  const g = guides.find((x) => x.citySlug === citySlug && x.slug === slug)
  const c = cities.find((x) => x.slug === citySlug)
  if (!g || !c) notFound()
  const more = guides.filter((x) => x.citySlug === c.slug && x.slug !== g.slug)
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label"><Link href={`/${c.slug}`}>{c.nameUz}</Link> · More in {c.name}</p>
          <h1 style={{marginTop: 16, maxWidth: '18ch'}}>{g.title}</h1>
          {g.summary && <p className="muted" style={{marginTop: 14, fontSize: '1.15rem', maxWidth: '56ch'}}>{g.summary}</p>}
        </div>
        {g.cover && <div className="wrap"><img className="hero-img" src={`${g.cover.url}?w=1600&h=900&fit=crop&auto=format`} alt={g.title} /></div>}
      </section>

      {g.intro && (
        <section>
          <div className="wrap"><div className="prose">{g.intro.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div></div>
        </section>
      )}

      {g.items.length > 0 && (() => {
        const pts = g.items.flatMap((it, i) => (it.lat != null && it.lon != null ? [{n: i + 1, title: it.title, lat: it.lat, lon: it.lon, href: `#item-${i + 1}`}] : []))
        return (
          <section>
            <div className="wrap" style={{display: 'grid', gap: 28}}>
              {pts.length > 0 && <GuideMap points={pts} />}
              <div className="guide-grid">
                {g.items.map((it, i) => {
                  const photos = it.images && it.images.length ? it.images : it.image ? [it.image] : []
                  return (
                    <article className="guide-card" key={i} id={`item-${i + 1}`}>
                      {photos.length > 0 && (
                        <div className={`gphotos${photos.length > 1 ? ' multi' : ''}`}>
                          {photos.map((ph, k) => (
                            <a key={k} href={ph.url} target="_blank" rel="noopener"><img src={ph.url} alt={`${it.title}${k ? ` (${k + 1})` : ''}`} /></a>
                          ))}
                        </div>
                      )}
                      <div className="body">
                        <p className="label">{pad(i + 1)}{it.area ? ` · ${it.area}` : ''}</p>
                        <h3>{it.title}</h3>
                        {it.text && <p className="muted">{it.text}</p>}
                        {it.credit && <p className="credit">{it.credit}</p>}
                        {it.mapsUrl && <a className="btn ghost sm" href={it.mapsUrl} target="_blank" rel="noopener">Open on the map ↗</a>}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {g.gallery.length > 0 && (
        <section>
          <div className="wrap gallery">
            {g.gallery.map((im, i) => <img key={i} src={`${im.url}?w=900&h=900&fit=crop&auto=format`} alt="" loading="lazy" />)}
          </div>
        </section>
      )}

      {g.sourceUrl && (
        <section>
          <div className="wrap">
            <a className="source-cta" href={g.sourceUrl} target="_blank" rel="noopener">
              <div><p className="label">Want more?</p><h3>{g.sourceText || 'More on this topic'}</h3></div>
              <span className="btn">{g.sourceLabel || 'Open'} ↗</span>
            </a>
          </div>
        </section>
      )}

      <section>
        <div className="wrap" style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
          <Link className="btn" href={`/${c.slug}`}>← Back to {c.name}</Link>
          {more.map((m) => <Link key={m.slug} className="btn ghost" href={`/${c.slug}/${m.slug}`}>{m.title}</Link>)}
        </div>
      </section>
    </>
  )
}
