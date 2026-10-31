'use client'
import {useEffect, useMemo, useState} from 'react'
import {botLink, catIcon, catName, catOrder, MIN_VOTES, rankOf, ratingOf, votesOf, type Place} from '@/lib/places'
import type {Lang} from '@/lib/i18n'

type Texts = {
  all: string; search: string; popular: string; az: string; empty: string; loading: string; unavailable: string
  map: string; more: string; rate: string; noVotes: string; votes: {one: string; few: string; many: string}
}

// Список мест с фильтром по категориям, поиском и сортировкой.
// Стартовые данные приходят из сборки, свежие (новые места и рейтинг) — из /api/places после открытия страницы.
export default function PlacesList({lang, slug, initial, tx}: {lang: Lang; slug: string; initial: Place[]; tx: Texts}) {
  const [places, setPlaces] = useState(initial)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>(initial.length ? 'idle' : 'loading')
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'popular' | 'az'>('popular')

  useEffect(() => {
    let alive = true
    fetch(`/api/places?city=${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: {places?: Place[]}) => {
        if (alive && Array.isArray(d.places)) { setPlaces(d.places); setState('idle') }
      })
      .catch(() => alive && setState((s) => (s === 'loading' ? 'error' : s)))
    return () => { alive = false }
  }, [slug])

  const cats = useMemo(() => {
    const m = new Map<string, number>()
    places.forEach((p) => m.set(p.category, (m.get(p.category) || 0) + 1))
    return [...m.entries()].sort((a, b) => catOrder(a[0]) - catOrder(b[0]))
  }, [places])

  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
  const list = useMemo(() => {
    const nq = norm(q.trim())
    return places
      .filter((p) => !cat || p.category === cat)
      .filter((p) => !nq || norm(p.name).includes(nq) || norm(p.description).includes(nq))
      .sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name, lang) : rankOf(b) - rankOf(a) || a.name.localeCompare(b.name, lang)))
  }, [places, cat, q, sort, lang])

  // Формы слова «голос»: русские правила подходят и для английского (one/many), в узбекском форма одна.
  const votesText = (n: number) => {
    const m10 = n % 10, m100 = n % 100
    const form = m10 === 1 && m100 !== 11 ? 'one' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'few' : 'many'
    return tx.votes[lang === 'en' ? (n === 1 ? 'one' : 'many') : form].replace('{n}', String(n))
  }
  const fmt = (n: number) => n.toFixed(1).replace('.', lang === 'en' ? '.' : ',')

  return (
    <div className="pl">
      <div className="pl-tools">
        <div className="pl-chips" role="group" aria-label={tx.all}>
          <button type="button" className={!cat ? 'on' : ''} aria-pressed={!cat} onClick={() => setCat('')}>{tx.all} · {places.length}</button>
          {cats.map(([c, n]) => (
            <button type="button" key={c} className={cat === c ? 'on' : ''} aria-pressed={cat === c} onClick={() => setCat(cat === c ? '' : c)}>
              <span aria-hidden="true">{catIcon(c)}</span> {catName(c, lang)} · {n}
            </button>
          ))}
        </div>
        <div className="pl-row">
          <input id="pl-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx.search} aria-label={tx.search} />
          <div className="pl-sort" role="group">
            <button type="button" className={sort === 'popular' ? 'on' : ''} aria-pressed={sort === 'popular'} onClick={() => setSort('popular')}>{tx.popular}</button>
            <button type="button" className={sort === 'az' ? 'on' : ''} aria-pressed={sort === 'az'} onClick={() => setSort('az')}>{tx.az}</button>
          </div>
        </div>
      </div>

      {state === 'loading' && !places.length && <p className="muted">{tx.loading}</p>}
      {state === 'error' && !places.length && <p className="muted">{tx.unavailable}</p>}
      {places.length > 0 && list.length === 0 && <p className="muted">{tx.empty}</p>}

      <ul className="pl-grid">
        {list.map((p) => {
          const v = votesOf(p)
          return (
            <li key={p.id} className="pl-card" id={`place-${p.id}`}>
              <Photo src={p.photo} alt={p.name} icon={catIcon(p.category)} />
              <div className="pl-body">
                <p className="label">{catIcon(p.category)} {catName(p.category, lang)}</p>
                <h3>{p.name}</h3>
                {p.description && <p className="muted pl-desc">{p.description}</p>}
                <p className="pl-rating">
                  {v >= MIN_VOTES ? (
                    <><b>★ {fmt(ratingOf(p))}</b> <span className="muted">· {votesText(v)}</span></>
                  ) : (
                    <span className="muted">{tx.noVotes}</span>
                  )}
                </p>
                <div className="pl-actions">
                  {p.location && <a className="btn ghost sm" href={p.location} target="_blank" rel="noopener">{tx.map} ↗</a>}
                  {p.link && <a className="btn ghost sm" href={p.link} target="_blank" rel="noopener">{tx.more} ↗</a>}
                  <a className="btn sm" href={botLink(p.id)} target="_blank" rel="noopener">👍 {tx.rate}</a>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Фото по чужой ссылке может не загрузиться (сайт удалил картинку или запрещает показ) — тогда значок категории.
function Photo({src, alt, icon}: {src: string; alt: string; icon: string}) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return <div className="pl-photo pl-ph" aria-hidden="true">{icon}</div>
  return <img className="pl-photo" src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
}
