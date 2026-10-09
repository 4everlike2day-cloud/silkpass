import LeadForm from '@/components/LeadForm'
import {getCities} from '@/lib/data'

export const metadata = {title: 'For partners'}

const FORMATS = [
  ['Stamp point', 'Keep the city stamp. Travellers come to you, and your venue is listed on the city page that the passport QR code opens.'],
  ['Sales point', 'Sell passports at your reception or counter and keep a margin on each one.'],
  ['Passport holder deal', 'Offer a discount or bonus for passport holders. We list it on the city page.'],
  ['Advertising', 'A sponsored slot on a city page for hotels, tours, guides, eSIM and money exchange.'],
]

export default async function Partners() {
  const cities = await getCities()
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">For partners</p>
          <h1 style={{marginTop: 18, maxWidth: '16ch'}}>Bring travellers to your door</h1>
          <p className="muted" style={{marginTop: 18, maxWidth: '56ch', fontSize: '1.08rem'}}>
            Every passport holder is looking for the stamp point in each city. Host a stamp, offer a deal or advertise on the city pages that travellers open by QR code.
          </p>
        </div>
      </section>
      <section>
        <div className="wrap grid2">
          {FORMATS.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}
        </div>
      </section>
      <section>
        <div className="wrap" style={{maxWidth: 720}}>
          <h2 style={{marginBottom: 24}}>Apply</h2>
          <LeadForm
            kind="partner"
            submitLabel="Send application"
            success="Thank you. We received your application and will contact you soon."
            fields={[
              {id: 'business', label: 'Business name', required: true},
              {id: 'city', label: 'City', type: 'select', options: cities.map((c) => c.name)},
              {id: 'format', label: 'Interested in', type: 'select', options: FORMATS.map((f) => f[0])},
              {id: 'contact', label: 'Phone or Telegram', required: true},
              {id: 'note', label: 'Anything else', type: 'textarea'},
            ]}
          />
        </div>
      </section>
    </>
  )
}
