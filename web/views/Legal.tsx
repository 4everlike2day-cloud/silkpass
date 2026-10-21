import Link from 'next/link'
import {getSettings} from '@/lib/data'
import {href, t, type Lang} from '@/lib/i18n'
import {LEGAL, LEGAL_SLUGS, LEGAL_UPDATED, SELLER, type LegalSlug} from '@/lib/legal'

export const legalMeta = (lang: Lang, slug: LegalSlug) => ({title: LEGAL[slug][lang].title, description: LEGAL[slug][lang].lede})

export default async function Legal({lang, slug}: {lang: Lang; slug: LegalSlug}) {
  const doc = LEGAL[slug][lang]
  const l = t(lang).legal
  const s = await getSettings(lang)
  const vars: Record<string, string> = {
    email: s.email || 'hello@silkpass.uz',
    telegram: s.telegram ? `@${s.telegram}` : '',
    whatsapp: s.whatsapp ? `+${s.whatsapp}` : '',
    sellerName: SELLER.name[lang],
    sellerStatus: SELLER.status[lang],
    sellerCity: SELLER.city[lang],
  }
  const fill = (p: string) => p.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)

  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">{l.label}</p>
          <h1 style={{marginTop: 18, maxWidth: '18ch'}}>{doc.title}</h1>
          <p className="muted" style={{marginTop: 18, maxWidth: '60ch', fontSize: '1.1rem'}}>{fill(doc.lede)}</p>
        </div>
      </section>
      <section>
        <div className="wrap legal-grid">
          <article className="legal">
            {doc.sections.map(([h, all]) => {
              // Строки с пустым контактом (например, WhatsApp не указан в настройках) не показываем.
              const paras = all.filter((p) => !/\{(telegram|whatsapp)\}/.test(p) || vars[p.match(/\{(telegram|whatsapp)\}/)![1]])
              const items = paras.filter((p) => p.startsWith('• '))
              const text = paras.filter((p) => !p.startsWith('• '))
              const firstItem = paras.findIndex((p) => p.startsWith('• '))
              const before = firstItem < 0 ? text : paras.slice(0, firstItem).filter((p) => !p.startsWith('• '))
              const after = firstItem < 0 ? [] : paras.slice(firstItem).filter((p) => !p.startsWith('• '))
              return (
                <div key={h}>
                  <h2>{h}</h2>
                  {before.map((p, i) => <p key={`b${i}`}>{fill(p)}</p>)}
                  {items.length > 0 && <ul>{items.map((p, i) => <li key={i}>{fill(p.slice(2))}</li>)}</ul>}
                  {after.map((p, i) => <p key={`a${i}`}>{fill(p)}</p>)}
                </div>
              )
            })}
            <p className="muted small">{l.updated}: {LEGAL_UPDATED}</p>
          </article>
          <nav className="legal-nav card" aria-label={l.label}>
            <p className="label">{l.label}</p>
            {LEGAL_SLUGS.map((x) => (
              <Link key={x} href={href(lang, `/${x}`)} aria-current={x === slug ? 'page' : undefined}>{l.names[x]}</Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
