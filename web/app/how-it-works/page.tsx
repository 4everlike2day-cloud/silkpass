import {getCities, getSettings, pad} from '@/lib/data'

export const metadata = {title: 'How it works'}

export default async function HowItWorks() {
  const [settings, cities] = await Promise.all([getSettings(), getCities()])
  const last = cities[cities.length - 1]
  const steps: [string, React.ReactNode][] = [
    ['Get a passport', 'Buy it at a partner point on the route or in our online shop. Write your name on the owner page.'],
    ['Open the city page', 'Each city spread has a QR code. Scan it to see the stamp point, its opening hours and a short city guide.'],
    ['Get the stamp', 'Show your passport at the stamp point. Staff will stamp the city page. One stamp per city.'],
    ['Write the date', 'Add the date in the space under the stamp, by hand. It becomes your travel record.'],
    ['Share it', <>Post a photo of your passport and tag <b>{settings.hashtag}</b>. Partners sometimes have bonuses for posts.</>],
    ['Complete the route', `Collect all ${cities.length} stamps${last ? ` and show the full passport at the ${last.name} stamp point` : ''} for your reward.`],
  ]
  return (
    <>
      <section><div className="wrap"><p className="label">How it works</p><h1 style={{marginTop: 18, maxWidth: '14ch'}}>Your passport, step by step</h1></div></section>
      <section>
        <div className="wrap">
          <ol className="places">
            {steps.map(([t, d], i) => (
              <li key={i}><span className="n">{pad(i + 1)}</span><div><h3>{t}</h3><p className="muted">{d}</p></div></li>
            ))}
          </ol>
        </div>
      </section>
      <section>
        <div className="wrap grid2">
          <div className="card"><p className="label">Reward</p><h3>All {cities.length} stamps</h3><p className="muted">{settings.rewardText}</p></div>
          <div className="card"><p className="label">Rules</p><h3>Keep it fair</h3><p className="muted">Stamps are given only in person at official stamp points. The order of cities does not matter, so start wherever your trip starts.</p></div>
        </div>
      </section>
    </>
  )
}
