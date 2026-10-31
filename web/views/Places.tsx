import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getCity} from '@/lib/data'
import {href, type Lang} from '@/lib/i18n'
import {BOT, botLink, getPlaces, PLACE_CITIES, placesEnabled, sheetCity} from '@/lib/places'
import PlacesList from '@/components/PlacesList'
import PlaceSuggest from '@/components/PlaceSuggest'

// «Что посмотреть»: welcome2.uz/<город>/places. Места — из Google-таблицы, рейтинг — из голосов в Telegram-боте.
export const placesParams = async () => PLACE_CITIES.filter((c) => c.enabled).map((c) => ({city: c.slug}))

// Русские падежи названий городов: «в Ташкенте», «места Ташкента».
const RU_CASE: Record<string, [string, string]> = {Ташкент: ['Ташкенте', 'Ташкента'], Самарканд: ['Самарканде', 'Самарканда'], Бухара: ['Бухаре', 'Бухары'], Хива: ['Хиве', 'Хивы']}
const ruIn = (c: string) => RU_CASE[c]?.[0] || c
const ruOf = (c: string) => RU_CASE[c]?.[1] || c

const TX = {
  en: {
    label: 'What to see', title: (c: string) => `What to see in ${c}`,
    lead: (c: string) => `Places in ${c} we recommend, by category. The rating comes from travellers' votes in our Telegram bot.`,
    botTitle: 'Rate the places in Telegram', botText: 'Been somewhere? Give it 👍 or 👎 in our bot. One vote per person, so the rating stays fair.',
    botBtn: 'Open the bot', back: (c: string) => `← ${c}`,
    list: {all: 'All', search: 'Search by name or description', popular: 'Popular first', az: 'A–Z', empty: 'Nothing found. Try another word or category.', loading: 'Loading places…', unavailable: 'Could not load the list. Please refresh the page.', map: 'Map', more: 'More', rate: 'Rate in Telegram', noVotes: 'No ratings yet', votes: {one: '{n} vote', few: '{n} votes', many: '{n} votes'}},
    suggestLabel: 'Know a great place?', suggestTitle: 'Suggest a place', suggestText: "We check every suggestion and add the best ones to the list. Name is enough, the rest helps.",
    form: {name: 'Place name', category: 'Category', categoryAny: 'Not sure', description: 'Why go there', link: 'Link (website, Instagram)', location: 'Map link', contact: 'Your contact (optional)', send: 'Send', ok: 'Thank you! We will check the place and add it to the list.', hint: 'We use your contact only to ask about this place.'},
    note: 'Descriptions are in Russian for now, translations are coming.',
  },
  ru: {
    label: 'Что посмотреть', title: (c: string) => `Что посмотреть в ${ruIn(c)}`,
    lead: (c: string) => `Места ${ruOf(c)}, которые мы советуем, по категориям. Рейтинг складывается из голосов путешественников в нашем Telegram-боте.`,
    botTitle: 'Оценивайте места в Telegram', botText: 'Были где-то из списка? Поставьте 👍 или 👎 в нашем боте. Один голос на человека, поэтому рейтинг честный.',
    botBtn: 'Открыть бота', back: (c: string) => `← ${c}`,
    list: {all: 'Все', search: 'Поиск по названию или описанию', popular: 'Сначала популярные', az: 'А–Я', empty: 'Ничего не нашлось. Попробуйте другое слово или категорию.', loading: 'Загружаем места…', unavailable: 'Не удалось загрузить список. Обновите страницу.', map: 'На карте', more: 'Подробнее', rate: 'Оценить в Telegram', noVotes: 'Оценок пока нет', votes: {one: '{n} голос', few: '{n} голоса', many: '{n} голосов'}},
    suggestLabel: 'Знаете хорошее место?', suggestTitle: 'Предложить место', suggestText: 'Мы проверяем каждое предложение и добавляем лучшие в список. Хватит названия, остальное поможет.',
    form: {name: 'Название места', category: 'Категория', categoryAny: 'Не знаю', description: 'Чем интересно', link: 'Ссылка (сайт, Instagram)', location: 'Ссылка на карту', contact: 'Ваш контакт (необязательно)', send: 'Отправить', ok: 'Спасибо! Мы проверим место и добавим его в список.', hint: 'Контакт нужен, только чтобы уточнить детали о месте.'},
    note: '',
  },
  uz: {
    label: "Nimani ko'rish kerak", title: (c: string) => `${c}da nimani ko'rish kerak`,
    lead: (c: string) => `${c}da biz tavsiya qiladigan joylar, toifalar bo'yicha. Reyting sayohatchilarning Telegram-botimizdagi ovozlaridan shakllanadi.`,
    botTitle: 'Joylarni Telegramda baholang', botText: "Ro'yxatdagi joyda bo'lganmisiz? Botimizda 👍 yoki 👎 bosing. Har kishiga bitta ovoz, shuning uchun reyting halol.",
    botBtn: 'Botni ochish', back: (c: string) => `← ${c}`,
    list: {all: 'Hammasi', search: "Nomi yoki tavsifi bo'yicha qidirish", popular: 'Avval mashhurlari', az: 'A–Z', empty: "Hech narsa topilmadi. Boshqa so'z yoki toifani tanlang.", loading: 'Joylar yuklanmoqda…', unavailable: "Ro'yxatni yuklab bo'lmadi. Sahifani yangilang.", map: 'Xaritada', more: 'Batafsil', rate: 'Telegramda baholash', noVotes: "Hozircha baholar yo'q", votes: {one: '{n} ta ovoz', few: '{n} ta ovoz', many: '{n} ta ovoz'}},
    suggestLabel: 'Yaxshi joyni bilasizmi?', suggestTitle: 'Joy taklif qilish', suggestText: "Har bir taklifni tekshirib, eng yaxshilarini ro'yxatga qo'shamiz. Nomi yetarli, qolgani yordam beradi.",
    form: {name: 'Joy nomi', category: 'Toifa', categoryAny: 'Bilmayman', description: 'Nimasi qiziq', link: 'Havola (sayt, Instagram)', location: 'Xarita havolasi', contact: 'Kontaktingiz (ixtiyoriy)', send: 'Yuborish', ok: "Rahmat! Joyni tekshirib, ro'yxatga qo'shamiz.", hint: 'Kontakt faqat joy haqida aniqlashtirish uchun kerak.'},
    note: 'Tavsiflar hozircha rus tilida, tarjimalar tez orada.',
  },
}

export async function placesMeta(lang: Lang, slug: string) {
  const c = await getCity(slug, lang)
  if (!c || !placesEnabled(slug)) return {robots: {index: false}}
  const tx = TX[lang]
  return {title: tx.title(lang === 'uz' ? c.nameUz : c.name), description: tx.lead(lang === 'uz' ? c.nameUz : c.name)}
}

export default async function PlacesPage({lang, slug}: {lang: Lang; slug: string}) {
  const c = await getCity(slug, lang)
  if (!c || !placesEnabled(slug)) notFound()
  const tx = TX[lang]
  const name = lang === 'uz' ? c.nameUz : c.name
  const places = await getPlaces(slug)

  return (
    <>
      <section>
        <div className="wrap">
          <p className="label"><Link href={href(lang, `/${c.slug}`)}>{c.nameUz}</Link> · {tx.label}</p>
          <h1 style={{marginTop: 16, maxWidth: '16ch'}}>{tx.title(name)}</h1>
          <p className="muted" style={{marginTop: 14, fontSize: '1.15rem', maxWidth: '58ch'}}>{tx.lead(name)}</p>
          {tx.note && <p className="muted" style={{marginTop: 10, fontSize: '.92rem'}}><i>{tx.note}</i></p>}
          <div className="pl-bot">
            <div>
              <h3>{tx.botTitle}</h3>
              <p className="muted">{tx.botText}</p>
            </div>
            <a className="btn" href={botLink()} target="_blank" rel="noopener">✈ @{BOT}</a>
          </div>
        </div>
      </section>

      <section style={{paddingTop: 8, borderTop: 0}}>
        <div className="wrap">
          <PlacesList lang={lang} slug={slug} initial={places} tx={tx.list} />
        </div>
      </section>

      <section id="suggest">
        <div className="wrap grid2 pl-suggest">
          <div>
            <p className="label">{tx.suggestLabel}</p>
            <h2 style={{marginTop: 12}}>{tx.suggestTitle}</h2>
            <p className="muted" style={{marginTop: 12, maxWidth: '44ch'}}>{tx.suggestText}</p>
            <p style={{marginTop: 20}}><Link href={href(lang, `/${c.slug}`)}>{tx.back(c.nameUz)}</Link></p>
          </div>
          <div className="card"><PlaceSuggest lang={lang} city={sheetCity(slug)} tx={tx.form} /></div>
        </div>
      </section>
    </>
  )
}
