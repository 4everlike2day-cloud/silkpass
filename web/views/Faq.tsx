import {getFaq, getSettings} from '@/lib/data'
import {t, type Lang} from '@/lib/i18n'

export const faqMeta = (lang: Lang) => ({title: t(lang).faq.label})

export default async function Faq({lang}: {lang: Lang}) {
  const f = t(lang).faq
  const [faq, s] = await Promise.all([getFaq(lang), getSettings(lang)])
  return (
    <>
      <section><div className="wrap"><p className="label">{f.label}</p><h1 style={{marginTop: 18}}>{f.title}</h1></div></section>
      <section>
        <div className="wrap grid2" style={{alignItems: 'start'}}>
          <div>{faq.map((q, i) => <details className="q" key={i}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
          <div className="card">
            <p className="label">{f.contacts}</p><h3>{f.write}</h3>
            <dl className="kv">
              {s.instagram && <><dt>Instagram</dt><dd><a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener">@{s.instagram}</a></dd></>}
              {s.telegram && <><dt>Telegram</dt><dd><a href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener">@{s.telegram}</a></dd></>}
              {s.whatsapp && <><dt>WhatsApp</dt><dd><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener">+{s.whatsapp}</a></dd></>}
              {s.email && <><dt>Email</dt><dd>{s.email}</dd></>}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
