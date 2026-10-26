import type {Lang} from './i18n'

// «Советы гида» на странице города. Данные лежат в коде, по городу (slug).
type L = Record<Lang, string>
export type GuideTip = {title: string; text: string; mapsUrl: string}
export type GuideTips = {
  label: string
  title: string
  intro: string
  guide: {handle: string; url: string; platform: string; role: string; cta: string}
  tips: GuideTip[]
}

// ЧЕРНОВИК: блок пока скрыт на сайте. Чтобы показать — поставьте true.
const ENABLED = false

const maps = (q: string) => `https://yandex.uz/maps/?text=${encodeURIComponent(q)}`

const DATA: Record<string, {guide: {handle: string; url: string; platform: string; role: L}; tips: {title: L; text: L; q: string}[]}> = {
  samarkand: {
    guide: {handle: 'yourguide_uz', url: 'https://instagram.com/yourguide_uz', platform: 'Instagram',
      role: {en: 'Local guide in Samarkand', ru: 'Гид по Самарканду', uz: "Samarqand bo'yicha gid"}},
    tips: [
      {
        q: 'Meros paper mill Konigil Samarkand',
        title: {en: 'Konigil craft village', ru: 'Деревня ремесленников Конигиль', uz: "Konigil hunarmandlar qishlog'i"},
        text: {
          en: 'Watch Samarkand silk paper being made from mulberry bark, the old way — by hand, by the river, with a water mill.',
          ru: 'Здесь по старинной технологии делают самаркандскую шёлковую бумагу из коры тутовника — вручную, у реки, с водяной мельницей.',
          uz: "Bu yerda tut po'stlog'idan qadimiy usulda Samarqand ipak qog'ozi tayyorlanadi — qo'lda, daryo bo'yida, suv tegirmoni bilan.",
        },
      },
      {
        q: 'Hujum silk carpet factory Samarkand',
        title: {en: 'Hudjum carpet workshop', ru: 'Мастерская «Худжум»', uz: '«Hujum» ustaxonasi'},
        text: {
          en: 'Hand-knotted silk carpets: see the weavers at work and how one carpet takes months, knot by knot.',
          ru: 'Ковры ручной работы из шёлка: можно посмотреть, как работают ткачихи и как один ковёр месяцами вяжется узелок за узелком.',
          uz: "Qo'lda to'qilgan ipak gilamlar: to'quvchilar ishini va bitta gilam oylab tugunma-tugun qanday to'qilishini ko'ring.",
        },
      },
      {
        q: 'Eternal City Silk Road Samarkand',
        title: {en: 'Eternal City', ru: 'Вечный город', uz: 'Boqiy shahar'},
        text: {
          en: 'An old town recreated inside the Silk Road Samarkand complex: craft workshops, street food and beautiful evening lights.',
          ru: 'Старый город, воссозданный в комплексе Silk Road Samarkand: мастерские ремесленников, уличная еда и красивая вечерняя подсветка.',
          uz: "Silk Road Samarkand majmuasidagi qayta tiklangan qadimiy shahar: hunarmandlar ustaxonalari, ko'cha taomlari va kechki chiroqlar.",
        },
      },
    ],
  },
}

const TEXT: Record<Lang, {label: string; title: string; intro: string; cta: (p: string) => string}> = {
  en: {label: 'Guide’s tips', title: 'Off the postcard', intro: 'Three places our partner guide recommends beyond the classic sights.', cta: (p) => `Message on ${p}`},
  ru: {label: 'Советы гида', title: 'Не с открытки', intro: 'Три места, которые советует наш партнёр-гид помимо классических достопримечательностей.', cta: (p) => `Написать в ${p}`},
  uz: {label: 'Gid maslahati', title: 'Otkritkadan tashqari', intro: "Hamkor gidimiz klassik joylardan tashqari tavsiya qiladigan uchta joy.", cta: (p) => `${p}da yozish`},
}

export function guideTips(slug: string, lang: Lang): GuideTips | null {
  const d = DATA[slug]
  if (!ENABLED || !d) return null
  const t = TEXT[lang]
  return {
    label: t.label, title: t.title, intro: t.intro,
    guide: {handle: d.guide.handle, url: d.guide.url, platform: d.guide.platform, role: d.guide.role[lang], cta: t.cta(d.guide.platform)},
    tips: d.tips.map((x) => ({title: x.title[lang], text: x.text[lang], mapsUrl: maps(x.q)})),
  }
}
