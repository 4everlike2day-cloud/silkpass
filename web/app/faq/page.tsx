import {getFaq, getSettings} from '@/lib/data'

export const metadata = {title: 'FAQ & contacts'}

export default async function Faq() {
  const [faq, s] = await Promise.all([getFaq(), getSettings()])
  return (
    <>
      <section><div className="wrap"><p className="label">FAQ &amp; contacts</p><h1 style={{marginTop: 18}}>Questions</h1></div></section>
      <section>
        <div className="wrap grid2" style={{alignItems: 'start'}}>
          <div>{faq.map((q, i) => <details className="q" key={i}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
          <div className="card">
            <p className="label">Contacts</p><h3>Write to us</h3>
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
