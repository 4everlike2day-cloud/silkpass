import Link from 'next/link'
import RouteForm from '@/components/RouteForm'
import {getCities, getSettings, pad} from '@/lib/data'
import {getGifts} from '@/lib/gifts'
import {href, t, type Lang} from '@/lib/i18n'

export const rewardMeta = (lang: Lang) => ({title: t(lang).reward.label, description: t(lang).reward.meta})

// Шаги получения подарка. tag — хештег проекта из настроек сайта (#welcome2uz).
const STEPS: Record<Lang, (tag: string) => [string, string][]> = {
  en: (tag) => [
    ['Collect all four cities', 'Get a stamp from our partners in Tashkent, Samarkand, Bukhara and Khiva. The order does not matter. Only stamps collected in person count.'],
    ['Get the Route complete stamp', 'Show your passport to any of our partners. They check the four city stamps, add Route complete on the Route complete page and write your passport number next to it.'],
    ['Take a photo of that page', `Make sure the Route complete stamp and your passport number are clearly visible. Want to share it? Post it with ${tag} and tag us.`],
    ['Choose your gift', 'Send the form below with the passport number, the photo and the gift you like. We check the register and tell you how to get it: some gifts are handed out by our partners right away.'],
  ],
  ru: (tag) => [
    ['Соберите все четыре города', 'Получите печать у наших партнёров в Ташкенте, Самарканде, Бухаре и Хиве. Порядок не важен. Считаются только печати, собранные лично.'],
    ['Получите печать Route complete', 'Покажите паспорт любому нашему партнёру. Он проверит печати четырёх городов, поставит Route complete на странице Route complete и впишет рядом номер вашего паспорта.'],
    ['Сфотографируйте эту страницу', `Печать Route complete и номер паспорта должны хорошо читаться. Хотите поделиться? Выложите фото с ${tag} и отметьте нас.`],
    ['Выберите подарок', 'Отправьте форму ниже с номером паспорта, фото и подарком, который вам нравится. Мы сверим реестр и напишем, как его получить: часть подарков выдают наши партнёры сразу на месте.'],
  ],
  uz: (tag) => [
    ["To'rtta shaharni yig'ing", "Toshkent, Samarqand, Buxoro va Xivadagi hamkorlarimizdan muhr oling. Tartib muhim emas. Faqat shaxsan to'plangan muhrlar hisobga olinadi."],
    ['Route complete muhrini oling', "Pasportingizni istalgan hamkorimizga ko'rsating. U to'rtta shahar muhrini tekshiradi, Route complete sahifasiga muhr bosadi va yoniga pasport raqamingizni yozadi."],
    ['Shu sahifani suratga oling', `Route complete muhri va pasport raqami aniq ko'rinsin. Ulashmoqchimisiz? Suratni ${tag} bilan joylang va bizni belgilang.`],
    ["Sovg'ani tanlang", "Quyidagi formani pasport raqami, surat va yoqqan sovg'a bilan yuboring. Reestrni tekshirib, uni qanday olishni yozamiz: ba'zi sovg'alarni hamkorlarimiz joyida beradi."],
  ],
}

export default async function Reward({lang}: {lang: Lang}) {
  const r = t(lang).reward
  const [settings, cities, gifts] = await Promise.all([getSettings(lang), getCities(lang), getGifts(lang)])
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
      <section id="claim">
        <div className="wrap claim-grid">
          <div className="card claim-card">
            <p className="label">{r.form.label}</p>
            <h2 style={{fontSize: '1.7rem'}}>{r.form.title}</h2>
            <p className="muted">{r.form.lede}</p>
            <RouteForm lang={lang} gifts={gifts.map((g) => ({id: g.id, title: g.title}))} />
          </div>
          <div className="claim-side">
            {gifts.length > 0 && (
              <div className="card">
                <p className="label">{r.label}</p>
                <h3>{r.form.giftsTitle}</h3>
                <ul className="gift-list">
                  {gifts.map((g) => <li key={g.id}><b>{g.title}</b>{g.text && <span className="muted">{g.text}</span>}</li>)}
                </ul>
              </div>
            )}
            <div className="card">
              <p className="label">{r.rules}</p>
              <h3>{r.rulesTitle}</h3>
              <p className="muted">{r.rulesText}</p>
            </div>
            <div className="card">
              <p className="label">{r.promo}</p>
              <h3>{r.promoTitle}</h3>
              <p className="muted">{r.promoText}</p>
              <p style={{marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <a className="btn ghost" href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{contact.label}</a>
                <Link className="btn ghost" href={href(lang, '/where-to-buy')}>{r.points}</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
