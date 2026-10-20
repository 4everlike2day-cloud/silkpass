import Link from 'next/link'
import {getCities, getSettings, pad} from '@/lib/data'
import {href, t, type Lang} from '@/lib/i18n'

export const rewardMeta = (lang: Lang) => ({title: t(lang).reward.label, description: t(lang).reward.meta})

// Шаги получения подарка. tag — хештег проекта из настроек сайта (#welcome2uz).
const STEPS: Record<Lang, (tag: string) => [string, string][]> = {
  en: (tag) => [
    ['Collect all four cities', 'Get a stamp from our partners in Tashkent, Samarkand, Bukhara and Khiva. The order does not matter. Only stamps collected in person count.'],
    ['Get the Route complete stamp', 'Show your passport to any of our partners. They check the four city stamps, add Route complete on page 17 and write your passport number next to it.'],
    ['Post a photo', `Share page 17 with the Route complete stamp and your passport number on Instagram or Threads with ${tag}.`],
    ['Get your promo code', 'Send us the link to your post. We check the passport number and send you a 20% code for our souvenir shop. It also works on a passport for a friend.'],
  ],
  ru: (tag) => [
    ['Соберите все четыре города', 'Получите печать у наших партнёров в Ташкенте, Самарканде, Бухаре и Хиве. Порядок не важен. Считаются только печати, собранные лично.'],
    ['Получите печать Route complete', 'Покажите паспорт любому нашему партнёру. Он проверит печати четырёх городов, поставит Route complete на странице 17 и впишет рядом номер вашего паспорта.'],
    ['Опубликуйте фото', `Выложите в Instagram или Threads фото страницы 17 с печатью Route complete и номером паспорта, добавьте ${tag}.`],
    ['Получите промокод', 'Пришлите нам ссылку на пост. Мы сверим номер паспорта и отправим промокод на скидку 20% в сувенир-шопе. Он действует и на паспорт в подарок другу.'],
  ],
  uz: (tag) => [
    ["To'rtta shaharni yig'ing", "Toshkent, Samarqand, Buxoro va Xivadagi hamkorlarimizdan muhr oling. Tartib muhim emas. Faqat shaxsan to'plangan muhrlar hisobga olinadi."],
    ['Route complete muhrini oling', "Pasportingizni istalgan hamkorimizga ko'rsating. U to'rtta shahar muhrini tekshiradi, 17-sahifaga Route complete muhrini bosadi va yoniga pasport raqamingizni yozadi."],
    ["Surat joylang", `Route complete muhri va pasport raqami ko'rinadigan 17-sahifa suratini ${tag} bilan Instagram yoki Threads'ga joylang.`],
    ['Promokodingizni oling', "Post havolasini bizga yuboring. Pasport raqamini tekshirib, suvenir do'konimiz uchun 20% chegirma promokodini yuboramiz. U do'stingizga sovg'a pasport uchun ham amal qiladi."],
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
            {STEPS[lang](settings.hashtag || '#welcome2uz').map(([title, text], i) => (
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
