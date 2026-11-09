import type {Lang} from '@/lib/i18n'

// «Полезное в дороге»: welcome2.uz/info. На эту страницу ведёт QR со стр. 37 паспорта («Transport, money, SIM, apps»).
// Тексты статичные; ссылки проверены 09.11.2026. Цены и тарифы не пишем — они часто меняются.

type L = {label: string; url: string}
type Block = {title: string; items: {h: string; p: string; links?: L[]}[]}

const LINKS = {
  rail: {label: 'eticket.railway.uz', url: 'https://eticket.railway.uz'},
  bus: {label: 'avtoticket.uz', url: 'https://avtoticket.uz'},
  hy: {label: 'uzairways.com', url: 'https://www.uzairways.com'},
  centrum: {label: 'centrum-air.com', url: 'https://centrum-air.com'},
  booking: {label: 'booking.com', url: 'https://www.booking.com/country/uz.html'},
  emehmon: {label: 'emehmon.uz', url: 'https://emehmon.uz'},
  bot: {label: '@w2uz_bot', url: 'https://t.me/w2uz_bot'},
}

const TX: Record<Lang, {label: string; title: string; lead: string; updated: string; blocks: Block[]}> = {
  ru: {
    label: 'Полезное в дороге',
    title: 'Транспорт, деньги, связь',
    lead: 'Коротко о том, что пригодится в первые дни: где покупать билеты, как платить, какую SIM-карту взять и что поставить в телефон.',
    updated: 'Проверено в ноябре 2026. Цены и правила меняются — перед поездкой сверяйтесь с официальными сайтами.',
    blocks: [
      {title: 'Билеты между городами', items: [
        {h: 'Поезда', p: 'Скоростные «Афросиаб» и обычные поезда между Ташкентом, Самаркандом, Бухарой и Хивой. Билеты — на официальном сайте Узбекских железных дорог. Популярные «Афросиабы» раскупают быстро, покупайте заранее; имя и номер паспорта вводите точно как в документе.', links: [LINKS.rail]},
        {h: 'Междугородние автобусы', p: 'Онлайн-продажа билетов автовокзала «Ташкент».', links: [LINKS.bus]},
        {h: 'Самолёты', p: 'Внутренние рейсы Ташкент — Самарканд, Бухара, Ургенч (ближайший аэропорт к Хиве). Билеты — на сайтах авиакомпаний.', links: [LINKS.hy, LINKS.centrum]},
      ]},
      {title: 'По городу', items: [
        {h: 'Такси', p: 'Удобнее всего через приложение Yandex Go: цена видна заранее. Для входа нужен номер, на который придёт SMS. Иностранная карта может не пройти — держите наличные.'},
        {h: 'Метро Ташкента', p: 'Касс почти не осталось. На одну поездку — QR-билет в терминале на станции, на несколько — транспортная карта ATTO. Фотографировать в метро можно.'},
      ]},
      {title: 'Где жить', items: [
        {h: 'Отели и гостевые дома', p: 'Бронировать удобно через Booking.com. Отель сам регистрирует вас как туриста — сохраните подтверждение до конца поездки.', links: [LINKS.booking]},
        {h: 'Регистрация', p: 'Иностранцев регистрируют по месту проживания в первые 3 дня, при переезде в другой город — снова. Отели и хостелы делают это сами через систему E-mehmon; если живёте у друзей — регистрирует хозяин.', links: [LINKS.emehmon]},
      ]},
      {title: 'Деньги', items: [
        {h: 'Карта + наличные', p: 'Валюта — сум (UZS). Visa и Mastercard принимают отели, крупные рестораны и супермаркеты; на базарах, в такси и в регионах нужны наличные. Возьмите две карты и включите оплату за рубежом.'},
        {h: 'Обмен и банкоматы', p: 'Меняйте в банках и официальных обменниках, не на улице. Банкоматы лучше внутри банков; за пределами больших городов их мало — снимите заранее.'},
        {h: 'Таможня', p: 'Если ввозите больше 10 000 $ — заполните декларацию в двух экземплярах. Вывезти валюты больше, чем ввезли, нельзя.'},
      ]},
      {title: 'Связь', items: [
        {h: 'SIM-карта', p: 'Операторы: Beeline, Ucell, Mobiuz, Uzmobile. Нужен паспорт. Стойки в аэропорту работают не всегда — надёжнее офис оператора в городе.'},
        {h: 'eSIM', p: 'Туристический eSIM только с интернетом можно купить заранее (Airalo, Yesim, Saily и др.) и установить дома по Wi-Fi. На 1–2 недели обычно хватает 3–5 ГБ.'},
      ]},
      {title: 'Приложения', items: [
        {h: 'В телефон до поездки', p: 'Yandex Go — такси. Yandex Карты или 2ГИС — карты и транспорт. Переводчик с офлайн-узбекским. И наш бот — места с рейтингом путешественников.', links: [LINKS.bot]},
      ]},
      {title: 'Важно знать', items: [
        {h: 'Экстренные номера', p: 'Полиция 102 · Скорая 103 · МЧС 1050 · Туристическая полиция 1173.'},
        {h: 'Розетки и вода', p: '220 В, вилки европейского типа (C/F). Пить лучше бутилированную воду.'},
        {h: 'Мечети и святыни', p: 'Закрытые плечи и колени, женщинам — платок. Перед съёмкой людей спросите разрешения.'},
      ]},
    ],
  },
  en: {
    label: 'Travel essentials',
    title: 'Transport, money, SIM',
    lead: 'What helps in the first days: where to buy tickets, how to pay, which SIM to get and which apps to install.',
    updated: 'Checked in November 2026. Prices and rules change — check the official sites before you go.',
    blocks: [
      {title: 'Between cities', items: [
        {h: 'Trains', p: 'High-speed Afrosiyob and regular trains link Tashkent, Samarkand, Bukhara and Khiva. Buy on the official Uzbekistan Railways site. Popular Afrosiyob trains sell out fast, so book early, and enter your name and passport number exactly as in the document.', links: [LINKS.rail]},
        {h: 'Intercity buses', p: 'Online tickets from Tashkent bus station.', links: [LINKS.bus]},
        {h: 'Flights', p: 'Domestic flights from Tashkent to Samarkand, Bukhara and Urgench (the airport for Khiva). Book on the airlines’ sites.', links: [LINKS.hy, LINKS.centrum]},
      ]},
      {title: 'In the city', items: [
        {h: 'Taxi', p: 'Yandex Go is the easiest: you see the price before the ride. Sign-up needs a number that can receive SMS. Foreign cards may fail, so keep some cash.'},
        {h: 'Tashkent metro', p: 'Most ticket offices are gone. For one ride, buy a QR ticket at the station machine; for several, get an ATTO transport card. Taking photos in the metro is allowed.'},
      ]},
      {title: 'Where to stay', items: [
        {h: 'Hotels and guesthouses', p: 'Booking.com works well. Your hotel registers you as a tourist; keep the confirmation until you leave.', links: [LINKS.booking]},
        {h: 'Registration', p: 'Foreigners are registered at their place of stay within 3 days, and again in each new city. Hotels and hostels do it for you through E-mehmon; if you stay with friends, your host does it.', links: [LINKS.emehmon]},
      ]},
      {title: 'Money', items: [
        {h: 'Card plus cash', p: 'The currency is the som (UZS). Hotels, bigger restaurants and supermarkets take Visa and Mastercard; bazaars, taxis and the regions need cash. Bring two cards and enable payments abroad.'},
        {h: 'Exchange and ATMs', p: 'Change money at banks and official exchange desks, never on the street. Use ATMs inside banks; outside big cities there are few, so withdraw in advance.'},
        {h: 'Customs', p: 'Carrying more than $10,000? Fill in a customs declaration in two copies. You can’t take out more foreign currency than you brought in.'},
      ]},
      {title: 'Phone and internet', items: [
        {h: 'SIM card', p: 'Operators: Beeline, Ucell, Mobiuz, Uzmobile. You need your passport. Airport desks are not always open; an operator’s office in town is more reliable.'},
        {h: 'eSIM', p: 'A data-only travel eSIM (Airalo, Yesim, Saily and others) can be bought in advance and installed at home over Wi-Fi. 3–5 GB is usually enough for 1–2 weeks.'},
      ]},
      {title: 'Apps', items: [
        {h: 'Install before the trip', p: 'Yandex Go for taxis. Yandex Maps or 2GIS for maps and transport. A translator with offline Uzbek. And our bot: places rated by travellers.', links: [LINKS.bot]},
      ]},
      {title: 'Good to know', items: [
        {h: 'Emergency numbers', p: 'Police 102 · Ambulance 103 · Emergencies 1050 · Tourist police 1173.'},
        {h: 'Plugs and water', p: '220 V, European plugs (C/F). Drink bottled water.'},
        {h: 'Mosques and shrines', p: 'Cover shoulders and knees; women, a headscarf. Ask before photographing people.'},
      ]},
    ],
  },
  uz: {
    label: 'Yo‘l uchun foydali',
    title: 'Transport, pul, aloqa',
    lead: 'Birinchi kunlarda kerak bo‘ladiganlar: chiptani qayerdan olish, qanday to‘lash, qaysi SIM-karta va qaysi ilovalar.',
    updated: '2026-yil noyabrda tekshirilgan. Narx va qoidalar o‘zgaradi — safardan oldin rasmiy saytlarni ko‘ring.',
    blocks: [
      {title: 'Shaharlar orasida', items: [
        {h: 'Poyezdlar', p: 'Toshkent, Samarqand, Buxoro va Xiva orasida tezyurar «Afrosiyob» va oddiy poyezdlar. Chiptalar — O‘zbekiston temir yo‘llarining rasmiy saytida. «Afrosiyob» chiptalari tez tugaydi, oldindan oling; ism va pasport raqamini hujjatdagidek kiriting.', links: [LINKS.rail]},
        {h: 'Shaharlararo avtobuslar', p: '«Toshkent» avtovokzali chiptalari onlayn.', links: [LINKS.bus]},
        {h: 'Samolyotlar', p: 'Toshkentdan Samarqand, Buxoro va Urganchga (Xivaga eng yaqin aeroport) ichki reyslar. Chiptalar — aviakompaniyalar saytlarida.', links: [LINKS.hy, LINKS.centrum]},
      ]},
      {title: 'Shahar ichida', items: [
        {h: 'Taksi', p: 'Eng qulayi — Yandex Go ilovasi: narx oldindan ko‘rinadi. Kirish uchun SMS keladigan raqam kerak. Xorijiy karta o‘tmasligi mumkin — naqd pul olib yuring.'},
        {h: 'Toshkent metrosi', p: 'Kassalar deyarli qolmagan. Bir martalik yo‘l uchun — bekatdagi terminaldan QR-chipta, bir necha marta uchun — ATTO transport kartasi. Metroda suratga olish mumkin.'},
      ]},
      {title: 'Qayerda yashash', items: [
        {h: 'Mehmonxona va mehmon uylari', p: 'Booking.com orqali bron qilish qulay. Mehmonxona sizni turist sifatida o‘zi ro‘yxatdan o‘tkazadi — tasdiqnomani safar oxirigacha saqlang.', links: [LINKS.booking]},
        {h: 'Ro‘yxatdan o‘tish', p: 'Chet elliklar yashash joyida 3 kun ichida, boshqa shaharga ko‘chganda yana ro‘yxatdan o‘tkaziladi. Mehmonxona va xostellar buni E-mehmon tizimi orqali o‘zi qiladi; tanishlarnikida yashasangiz — uy egasi.', links: [LINKS.emehmon]},
      ]},
      {title: 'Pul', items: [
        {h: 'Karta va naqd pul', p: 'Valyuta — so‘m (UZS). Visa va Mastercard mehmonxona, katta restoran va supermarketlarda o‘tadi; bozor, taksi va viloyatlarda naqd pul kerak. Ikkita karta oling va xorijda to‘lovni yoqing.'},
        {h: 'Ayirboshlash va bankomatlar', p: 'Pulni bank va rasmiy ayirboshlash shoxobchalarida almashtiring, ko‘chada emas. Bank ichidagi bankomatlar ma’qul; katta shaharlardan tashqarida ular kam — oldindan yechib oling.'},
        {h: 'Bojxona', p: '10 000 $ dan ortiq olib kirsangiz — deklaratsiyani ikki nusxada to‘ldiring. Olib kirganingizdan ko‘p valyutani olib chiqib bo‘lmaydi.'},
      ]},
      {title: 'Aloqa', items: [
        {h: 'SIM-karta', p: 'Operatorlar: Beeline, Ucell, Mobiuz, Uzmobile. Pasport kerak. Aeroportdagi peshtaxtalar har doim ham ochiq emas — shahardagi operator ofisi ishonchliroq.'},
        {h: 'eSIM', p: 'Faqat internetli turistik eSIM’ni (Airalo, Yesim, Saily va boshqalar) oldindan sotib olib, uyda Wi-Fi orqali o‘rnatish mumkin. 1–2 haftaga odatda 3–5 GB yetadi.'},
      ]},
      {title: 'Ilovalar', items: [
        {h: 'Safardan oldin o‘rnating', p: 'Yandex Go — taksi. Yandex Xaritalar yoki 2GIS — xarita va transport. Oflayn o‘zbek tilli tarjimon. Va bizning bot — sayohatchilar baholagan joylar.', links: [LINKS.bot]},
      ]},
      {title: 'Bilish muhim', items: [
        {h: 'Favqulodda raqamlar', p: 'Politsiya 102 · Tez yordam 103 · FVV 1050 · Turistik politsiya 1173.'},
        {h: 'Rozetka va suv', p: '220 V, Yevropa vilkalari (C/F). Shishadagi suv ichgan ma’qul.'},
        {h: 'Masjid va ziyoratgohlar', p: 'Yelka va tizzalar yopiq bo‘lsin, ayollar — ro‘mol. Odamlarni suratga olishdan oldin ruxsat so‘rang.'},
      ]},
    ],
  },
}

export const infoMeta = (lang: Lang) => ({title: `${TX[lang].title} · ${TX[lang].label}`, description: TX[lang].lead})

export default function Info({lang}: {lang: Lang}) {
  const tx = TX[lang]
  return (
    <>
      <section>
        <div className="wrap">
          <p className="label">{tx.label}</p>
          <h1 style={{marginTop: 18, maxWidth: '16ch'}}>{tx.title}</h1>
          <p className="muted" style={{marginTop: 14, fontSize: '1.15rem', maxWidth: '58ch'}}>{tx.lead}</p>
        </div>
      </section>
      {tx.blocks.map((b) => (
        <section key={b.title}>
          <div className="wrap">
            <p className="label" style={{marginBottom: 14}}>{b.title}</p>
            <div className={b.items.length >= 3 ? 'grid3' : b.items.length === 2 ? 'grid2' : ''}>
              {b.items.map((it) => (
                <div className="card" key={it.h}>
                  <h3>{it.h}</h3>
                  <p className="muted">{it.p}</p>
                  {it.links && (
                    <p className="row" style={{marginTop: 'auto', gap: 8, flexWrap: 'wrap'}}>
                      {it.links.map((l) => <a key={l.url} className="btn ghost sm" href={l.url} target="_blank" rel="noopener">{l.label} ↗</a>)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section style={{borderTop: 0, paddingTop: 0}}>
        <div className="wrap"><p className="muted" style={{fontSize: '.92rem'}}><i>{tx.updated}</i></p></div>
      </section>
    </>
  )
}
