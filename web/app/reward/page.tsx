import Link from 'next/link'
import {getCities, getSettings, pad} from '@/lib/data'

export const metadata = {
  title: 'Reward',
  description: 'Collected all four city stamps? Here is how to get your gift.',
}

type Step = {en: [string, string]; uz: [string, string]}

const steps: Step[] = [
  {
    en: ['Collect the 4 main stamps', 'One stamp in each city: Toshkent, Samarqand, Buxoro and Xiva. The order does not matter. Extra stamps from cafés and workshops do not count.'],
    uz: ["4 ta asosiy muhrni yig'ing", "Har bir shaharda bittadan muhr: Toshkent, Samarqand, Buxoro va Xiva. Tartib muhim emas. Kafe va ustaxonalarning qo'shimcha muhrlari hisobga olinmaydi."],
  },
  {
    en: ['Get the Route complete stamp', 'Show your passport at any stamp point. The partner checks all four stamps and puts the Route complete stamp in the frame on page 17.'],
    uz: ['Route complete muhrini oling', "Pasportingizni istalgan muhr nuqtasida ko'rsating. Hamkor to'rtta muhrni tekshirib, 17-sahifadagi ramkaga Route complete muhrini qo'yadi."],
  },
  {
    en: ['Take your gift', 'The partner gives you a small souvenir, such as a postcard or a magnet, and signs the Gift received line.'],
    uz: ["Sovg'angizni oling", "Hamkor sizga kichik esdalik sovg'a beradi (otkritka yoki magnit) va Gift received qatoriga imzo qo'yadi."],
  },
  {
    en: ['No souvenirs left?', 'It happens. Send us a photo of page 17 with the Route complete stamp and you will get a promo code for our online shop. Or pick up the gift at the next partner.'],
    uz: ["Sovg'a qolmaganmi?", "Bunday bo'ladi. Route complete muhri bor 17-sahifa suratini bizga yuboring va onlayn do'kon uchun promokod oling. Yoki sovg'ani keyingi hamkordan oling."],
  },
]

export default async function Reward() {
  const [settings, cities] = await Promise.all([getSettings(), getCities()])
  const contact = settings.telegram
    ? {href: `https://t.me/${settings.telegram}`, label: `Telegram @${settings.telegram}`}
    : settings.instagram
      ? {href: `https://instagram.com/${settings.instagram}`, label: `Instagram @${settings.instagram}`}
      : {href: '/faq', label: 'FAQ & contacts'}
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">Reward · Sovg&apos;a</p>
          <h1 style={{marginTop: 18, maxWidth: '16ch'}}>Visited all {cities.length} cities? Here&apos;s your gift!</h1>
          <p className="muted" style={{marginTop: 14, fontSize: 20}}>{cities.length} ta shaharga bordingizmi? Sovg&apos;angizni oling!</p>
        </div>
      </section>

      <section>
        <div className="wrap grid2">
          <div>
            <p className="label" style={{marginBottom: 18}}>EN · How to get it</p>
            <ol className="places">
              {steps.map((s, i) => (
                <li key={i}><span className="n">{pad(i + 1)}</span><div><h3>{s.en[0]}</h3><p className="muted">{s.en[1]}</p></div></li>
              ))}
            </ol>
          </div>
          <div>
            <p className="label" style={{marginBottom: 18}}>UZ · Qanday olish mumkin</p>
            <ol className="places">
              {steps.map((s, i) => (
                <li key={i}><span className="n">{pad(i + 1)}</span><div><h3>{s.uz[0]}</h3><p className="muted">{s.uz[1]}</p></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap grid2">
          <div className="card">
            <p className="label">Rules · Qoidalar</p>
            <h3>One gift per passport</h3>
            <p className="muted">Stamps are given only in person at official stamp points. The Gift received line shows the gift has been taken.</p>
            <p className="muted" style={{marginTop: 10}}>Har bir pasportga bitta sovg&apos;a. Muhrlar faqat rasmiy muhr nuqtalarida shaxsan qo&apos;yiladi.</p>
          </div>
          <div className="card">
            <p className="label">Promo code · Promokod</p>
            <h3>Send us page 17</h3>
            <p className="muted">A clear photo of the Route complete stamp is enough. 17-sahifa suratini yuboring.</p>
            <p style={{marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <a className="btn" href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{contact.label}</a>
              <Link className="btn ghost" href="/where-to-buy">Stamp points</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
