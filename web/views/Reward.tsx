import Link from 'next/link'
import {getCities, getSettings, pad} from '@/lib/data'
import {href, t, type Lang} from '@/lib/i18n'

export const rewardMeta = (lang: Lang) => ({title: t(lang).reward.label, description: t(lang).reward.meta})

const STEPS: Record<Lang, [string, string][]> = {
  en: [
    ['Collect the 4 main stamps', 'One stamp in each city: Toshkent, Samarqand, Buxoro and Xiva. The order does not matter. Extra stamps from cafés and workshops do not count.'],
    ['Get the Route complete stamp', 'Show your passport at any stamp point. The partner checks all four stamps and puts the Route complete stamp in the frame on page 17.'],
    ['Take your gift', 'The partner gives you a small souvenir, such as a postcard or a magnet, and signs the Gift received line.'],
    ['No souvenirs left?', 'It happens. Send us a photo of page 17 with the Route complete stamp and you will get a promo code for our online shop. Or pick up the gift at the next partner.'],
  ],
  ru: [
    ['Соберите 4 основных штампа', 'По одному в каждом городе: Ташкент, Самарканд, Бухара и Хива. Порядок не важен. Дополнительные штампы кафе и мастерских не считаются.'],
    ['Получите штамп Route complete', 'Покажите паспорт в любой точке штампа. Партнёр проверит все четыре штампа и поставит штамп Route complete в рамку на странице 17.'],
    ['Заберите подарок', 'Партнёр вручит небольшой сувенир, например открытку или магнит, и распишется в строке Gift received.'],
    ['Сувениры закончились?', 'Бывает. Пришлите нам фото страницы 17 со штампом Route complete и получите промокод в наш онлайн-магазин. Или заберите подарок у следующего партнёра.'],
  ],
  uz: [
    ["4 ta asosiy muhrni yig'ing", "Har bir shaharda bittadan muhr: Toshkent, Samarqand, Buxoro va Xiva. Tartib muhim emas. Kafe va ustaxonalarning qo'shimcha muhrlari hisobga olinmaydi."],
    ['Route complete muhrini oling', "Pasportingizni istalgan muhr nuqtasida ko'rsating. Hamkor to'rtta muhrni tekshirib, 17-sahifadagi ramkaga Route complete muhrini qo'yadi."],
    ["Sovg'angizni oling", "Hamkor sizga kichik esdalik sovg'a beradi (otkritka yoki magnit) va Gift received qatoriga imzo qo'yadi."],
    ["Sovg'a qolmaganmi?", "Bunday bo'ladi. Route complete muhri bor 17-sahifa suratini bizga yuboring va onlayn do'kon uchun promokod oling. Yoki sovg'ani keyingi hamkordan oling."],
  ],
}

export default async function Reward({lang}: {lang: Lang}) {
  const r = t(lang).reward
  const [settings, cities] = await Promise.all([getSettings(lang), getCities(lang)])
  const contact = settings.telegram
    ? {href: `https://t.me/${settings.telegram}`, label: `Telegram @${settings.telegram}`}
    : settings.instagram
      ? {href: `https://instagram.com/${settings.instagram}`, label: `Instagram @${settings.instagram}`}
      : {href: href(lang, '/faq'), label: t(lang).nav.faqFull}
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">{r.label}</p>
          <h1 style={{marginTop: 18, maxWidth: '16ch'}}>{r.title(cities.length)}</h1>
        </div>
      </section>
      <section>
        <div className="wrap"><div style={{maxWidth: 820}}>
          <p className="label" style={{marginBottom: 18}}>{r.howTitle}</p>
          <ol className="places">
            {STEPS[lang].map(([title, text], i) => (
              <li key={i}><span className="n">{pad(i + 1)}</span><div><h3>{title}</h3><p className="muted">{text}</p></div></li>
            ))}
          </ol>
        </div></div>
      </section>
      <section>
        <div className="wrap grid2">
          <div className="card">
            <p className="label">{r.rules}</p>
            <h3>{r.rulesTitle}</h3>
            <p className="muted">{r.rulesText}</p>
          </div>
          <div className="card">
            <p className="label">{r.promo}</p>
            <h3>{r.promoTitle}</h3>
            <p className="muted">{r.promoText}</p>
            <p style={{marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <a className="btn" href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{contact.label}</a>
              <Link className="btn ghost" href={href(lang, '/where-to-buy')}>{r.points}</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
