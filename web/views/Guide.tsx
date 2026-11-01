import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getCities, getGuides, pad} from '@/lib/data'
import GuideMap from '@/components/GuideMap'
import Lightbox from '@/components/Lightbox'
import {href, t, type Lang} from '@/lib/i18n'

// Подборки по городам: welcome2.uz/<город>/<подборка>. Создаются в Sanity, тип «Подборка».
export async function guideParams() {
  const guides = await getGuides()
  // Статическому экспорту нужен хотя бы один адрес; пока подборок нет, отдаём служебную заглушку.
  if (guides.length === 0) return [{city: '_', guide: '_'}]
  return guides.map((g) => ({city: g.citySlug, guide: g.slug}))
}
export async function guideMeta(lang: Lang, city: string, guide: string) {
  const g = (await getGuides(lang)).find((x) => x.citySlug === city && x.slug === guide)
  return g ? {title: g.title, description: g.summary || undefined} : {robots: {index: false}}
}

// Ссылки в тексте в виде [текст](https://...)
function withLinks(text: string) {
  return text.split(/(\[[^\]]+\]\(https?:[^)\s]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\((https?:[^)\s]+)\)$/)
    return m ? <a key={i} href={m[2]} target="_blank" rel="noopener">{m[1]}</a> : part
  })
}

const LB: Record<Lang, {close: string; prev: string; next: string}> = {
  en: {close: 'Close', prev: 'Previous photo', next: 'Next photo'},
  ru: {close: 'Закрыть', prev: 'Предыдущее фото', next: 'Следующее фото'},
  uz: {close: 'Yopish', prev: 'Oldingi surat', next: 'Keyingi surat'},
}

export default async function GuidePage({lang, citySlug, slug}: {lang: Lang; citySlug: string; slug: string}) {
  const d = t(lang).guide
  const [guides, cities] = await Promise.all([getGuides(lang), getCities(lang)])
  const g = guides.find((x) => x.citySlug === citySlug && x.slug === slug)
  const c = cities.find((x) => x.slug === citySlug)
  if (!g || !c) notFound()
  const more = guides.filter((x) => x.citySlug === c.slug && x.slug !== g.slug)
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label"><Link href={href(lang, `/${c.slug}`)}>{c.nameUz}</Link> · {d.moreIn(c.name)}</p>
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

      {g.scheme && (
        <section>
          <div className="wrap">
            <figure className="guide-scheme">
              <a href={g.scheme.image} target="_blank" rel="noopener" data-zoom="scheme"><img src={g.scheme.image} alt={g.scheme.alt} loading="lazy" /></a>
              <figcaption>
                {g.scheme.creditUrl ? <a href={g.scheme.creditUrl} target="_blank" rel="noopener">{g.scheme.credit} ↗</a> : g.scheme.credit}
                {g.scheme.downloadUrl && <a className="btn ghost sm" href={g.scheme.downloadUrl} target="_blank" rel="noopener">{g.scheme.downloadLabel || 'PDF'} ↓</a>}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {g.items.length > 0 && (() => {
        const pts = g.items.flatMap((it, i) => (it.lat != null && it.lon != null ? [{n: i + 1, title: it.title, lat: it.lat, lon: it.lon, href: `#item-${i + 1}`}] : []))
        return (
          <section>
            <div className="wrap" style={{display: 'grid', gap: 28}}>
              {pts.length > 0 && <GuideMap points={pts} seePhoto={d.seePhoto} />}
              <div className="guide-grid">
                {g.items.map((it, i) => {
                  const photos = it.images && it.images.length ? it.images : it.image ? [it.image] : []
                  return (
                    <article className="guide-card" key={i} id={`item-${i + 1}`}>
                      {photos.length > 0 && (
                        <div className={`gphotos${photos.length > 1 ? ' multi' : ''}`}>
                          {photos.map((ph, k) => (
                            <a key={k} href={ph.url} target="_blank" rel="noopener" data-zoom="photos"><img src={ph.url} alt={`${it.title}${k ? ` (${k + 1})` : ''}`} /></a>
                          ))}
                        </div>
                      )}
                      <div className="body">
                        <p className="label">{pad(i + 1)}{it.area ? ` · ${it.area}` : ''}</p>
                        <h3>{it.title}</h3>
                        {it.text && <p className="muted">{it.text}</p>}
                        {it.credit && <p className="credit">{it.credit}</p>}
                        {it.mapsUrl && <a className="btn ghost sm" href={it.mapsUrl} target="_blank" rel="noopener">{d.openMap} ↗</a>}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {g.tips && (
        <section>
          <div className="wrap">
            <div className="guide-tips">
              <h2>{g.tips.title}</h2>
              <ul>{g.tips.items.map((t, i) => <li key={i}>{withLinks(t)}</li>)}</ul>
              {g.tips.sourceUrl && <p className="credit"><a href={g.tips.sourceUrl} target="_blank" rel="noopener">{g.tips.sourceLabel || g.tips.sourceUrl} ↗</a></p>}
            </div>
          </div>
        </section>
      )}

      {g.note && (
        <section>
          <div className="wrap">
            <div className="guide-note"><h3>{g.note.title}</h3><p>{g.note.text}</p></div>
          </div>
        </section>
      )}

      {g.cta && (
        <section>
          <div className="wrap">
            <Link className="source-cta" href={href(lang, g.cta.path)}>
              <div><p className="label">{g.cta.label}</p><h3>{g.cta.title}</h3></div>
              <span className="btn">{g.cta.button} →</span>
            </Link>
          </div>
        </section>
      )}

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
              <div><p className="label">{d.wantMore}</p><h3>{g.sourceText || d.moreTopic}</h3></div>
              <span className="btn">{g.sourceLabel || t(lang).city.open} ↗</span>
            </a>
          </div>
        </section>
      )}

      <Lightbox labels={LB[lang]} />

      <section>
        <div className="wrap" style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
          <Link className="btn" href={href(lang, `/${c.slug}`)}>{lang === 'en' ? `← ${d.back(c.name)}` : d.back(c.name)}</Link>
          {more.map((m) => <Link key={m.slug} className="btn ghost" href={href(lang, `/${c.slug}/${m.slug}`)}>{m.title}</Link>)}
        </div>
      </section>
    </>
  )
}
