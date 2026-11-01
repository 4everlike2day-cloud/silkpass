import LeadForm from '@/components/LeadForm'
import {getCities} from '@/lib/data'
import {t, type Lang} from '@/lib/i18n'

export const partnersMeta = (lang: Lang) => ({title: t(lang).partners.label})

export default async function Partners({lang}: {lang: Lang}) {
  const p = t(lang).partners
  const cities = await getCities(lang)
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">{p.label}</p>
          <h1 style={{marginTop: 18, maxWidth: '16ch'}}>{p.title}</h1>
          <p className="muted" style={{marginTop: 18, maxWidth: '56ch', fontSize: '1.08rem'}}>{p.lede}</p>
        </div>
      </section>
      <section>
        <div className="wrap grid2">
          {p.formats.map(([title, text]) => <div className="card" key={title}><h3>{title}</h3><p className="muted">{text}</p></div>)}
        </div>
      </section>
      <section>
        <div className="wrap" id="apply" style={{maxWidth: 720, scrollMarginTop: 90}}>
          <h2 style={{marginBottom: 24}}>{p.apply}</h2>
          <LeadForm
            kind="partner"
            lang={lang}
            submitLabel={p.send}
            success={p.ok}
            fields={[
              {id: 'business', label: p.fBusiness, required: true},
              {id: 'city', label: p.fCity, type: 'select', options: cities.map((c) => c.name)},
              {id: 'format', label: p.fFormat, type: 'select', options: p.formats.map((f) => f[0])},
              {id: 'contact', label: p.fContact, required: true},
              {id: 'note', label: p.fNote, type: 'textarea'},
            ]}
          />
        </div>
      </section>
    </>
  )
}
