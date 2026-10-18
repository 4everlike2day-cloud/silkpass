import type {Lang} from './i18n'
import type {Guide, GuideItem} from './types'

// Подборки, которые лежат прямо в коде (фото в public/guides/...), на трёх языках.
// Позже их можно перенести в Sanity: подборка с тем же городом и адресом заменит эту.

type L = Record<Lang, string>
const img = (dir: string, n: string) => ({url: `/guides/${dir}/${n}.webp`, alt: ''})
const yandex = (lat: number, lon: number) => `https://yandex.uz/maps/?pt=${lon},${lat}&z=17&l=map`

type MuralSrc = {n: string; title: L; text: L; lat: number; lon: number; extra?: string[]; area?: L; credit?: string}

const MURALS: MuralSrc[] = [
  {
    n: '1', extra: ['1-1'], lat: 41.2995, lon: 69.2662,
    title: {en: 'Tile-pattern tower', ru: 'Дом в изразцах', uz: 'Koshinli uy'},
    text: {
      en: 'A whole block dressed in blue majolica stars, with a family scene painted at street level.',
      ru: 'Целый дом в синих майоликовых звёздах, а внизу, на уровне улицы, семейная сцена.',
      uz: "Butun bino ko'k majolika yulduzlari bilan bezatilgan, pastida esa oilaviy manzara.",
    },
  },
  {
    n: '2', lat: 41.3463, lon: 69.2848,
    title: {en: 'Six portraits in smoke', ru: 'Шесть портретов в дыму', uz: 'Tutun ichidagi olti portret'},
    text: {
      en: 'Black-and-white portraits of six men wrapped in swirling smoke, on a modern facade.',
      ru: 'Чёрно-белые портреты шести мужчин в клубах дыма на современном фасаде.',
      uz: "Zamonaviy bino devorida burama tutun ichidagi olti erkakning oq-qora portretlari.",
    },
  },
  {
    n: '3', lat: 41.254644, lon: 69.377806,
    title: {en: 'Children in the meadow', ru: 'Дети на лугу', uz: "O'tloqdagi bolalar"},
    text: {
      en: 'Kids running through grass and soap bubbles across an entire facade.',
      ru: 'Дети бегут по траве среди мыльных пузырей — на весь фасад.',
      uz: "Butun devor bo'ylab o'tlar va sovun pufaklari orasida yugurayotgan bolalar.",
    },
  },
  {
    n: '4', lat: 41.2841, lon: 69.2181,
    title: {en: 'Astronaut on the moon', ru: 'Космонавт на луне', uz: 'Oydagi kosmonavt'},
    text: {
      en: 'A cosmonaut resting on a crescent moon among planets.',
      ru: 'Космонавт отдыхает на полумесяце среди планет.',
      uz: "Sayyoralar orasida yarim oyda dam olayotgan kosmonavt.",
    },
  },
  {
    n: '5', lat: 41.278042, lon: 69.244666,
    title: {en: 'Portraits in red and green', ru: 'Портреты в красном и зелёном', uz: "Qizil va yashil portretlar"},
    text: {
      en: 'Three portraits on a red banner along a pedestrian street.',
      ru: 'Три портрета на красном полотне вдоль пешеходной улицы.',
      uz: "Piyodalar ko'chasi bo'ylab qizil fondagi uchta portret.",
    },
  },
  {
    n: '6', extra: ['6-1'], lat: 41.2562, lon: 69.1979, credit: 'Photo: gazeta.uz',
    title: {en: 'Girl with peacocks', ru: 'Девушка с павлинами', uz: "Tovuslar bilan qiz"},
    text: {
      en: 'A girl in a white doppi between two peacocks and cotton flowers. Next to it: a mother helping her son with a space helmet.',
      ru: 'Девушка в белой тюбетейке между двумя павлинами и цветами хлопка. Рядом — мама надевает сыну шлем космонавта.',
      uz: "Ikki tovus va paxta gullari orasida oq do'ppili qiz. Yonida ona o'g'liga kosmonavt dubulg'asini kiydirmoqda.",
    },
  },
  {
    n: '7', lat: 41.279595, lon: 69.225215,
    area: {en: 'Chilanzar, 2nd quarter', ru: 'Чиланзар, 2-й квартал', uz: 'Chilonzor, 2-mavze'},
    title: {en: 'City walkers', ru: 'Прохожие', uz: "Yo'lovchilar"},
    text: {
      en: 'A crowd of black-and-white figures with one in red, on a long courtyard wall.',
      ru: 'Толпа чёрно-белых фигур и одна красная на длинной стене двора.',
      uz: "Hovlining uzun devorida oq-qora odamlar olomoni va ular orasida bitta qizil.",
    },
  },
  {
    n: '8', lat: 41.296173, lon: 69.360289, credit: 'Artist: @dildoraartdizayn',
    area: {en: 'Tuzel, Yashnobod district', ru: 'Тузель, Яшнабадский район', uz: "To'zel, Yashnobod tumani"},
    title: {en: 'Cherry harvest', ru: 'Сбор вишни', uz: "Olcha terimi"},
    text: {
      en: 'A woman in ikat silk picking cherries, painted the full height of the building.',
      ru: 'Женщина в атласе икат собирает вишню — во всю высоту дома.',
      uz: "Atlas ko'ylakdagi ayol olcha termoqda, rasm binoning butun balandligida.",
    },
  },
  {
    n: '9', lat: 41.225577, lon: 69.215381, credit: 'Photo: nuz.uz',
    area: {en: 'Sergeli-VI, building 3', ru: 'Сергели-VI, дом 3', uz: "Sergeli-VI, 3-uy"},
    title: {en: 'Face in the wind', ru: 'Лицо на ветру', uz: 'Shamoldagi yuz'},
    text: {
      en: 'A calm face with closed eyes against a turquoise sky.',
      ru: 'Спокойное лицо с закрытыми глазами на фоне бирюзового неба.',
      uz: "Feruza osmon fonida ko'zlari yumuq osoyishta yuz.",
    },
  },
  {
    n: '10', lat: 41.217822, lon: 69.211638,
    area: {en: 'Sergeli-VII', ru: 'Сергели-VII', uz: 'Sergeli-VII'},
    title: {en: 'Holding the Earth', ru: 'Земля в руках', uz: "Yer qo'lda"},
    text: {
      en: 'A girl with a long braid embracing the planet, on a new block in Sergeli.',
      ru: 'Девушка с длинной косой обнимает планету — на новом доме в Сергели.',
      uz: "Uzun sochli qiz sayyorani quchoqlamoqda — Sergelidagi yangi uyda.",
    },
  },
]

function mural(m: MuralSrc, lang: Lang): GuideItem {
  const photos = [m.n, ...(m.extra || [])].map((p) => img('tashkent-murals', p))
  return {
    title: m.title[lang], text: m.text[lang], image: photos[0], images: photos,
    mapsUrl: yandex(m.lat, m.lon), lat: m.lat, lon: m.lon, area: m.area?.[lang] || null, credit: m.credit || null,
  }
}

export function localGuides(lang: Lang): Guide[] {
  return [
    {
      slug: 'murals',
      citySlug: 'tashkent',
      title: {en: 'Murals of Tashkent', ru: 'Муралы Ташкента', uz: 'Toshkent murallari'}[lang],
      summary: {
        en: 'Ten big walls worth a detour, from space dreams to Uzbek ornament.',
        ru: 'Десять больших стен, ради которых стоит сделать крюк: от космоса до узбекского орнамента.',
        uz: "Yo'l ustida ko'rishga arziydigan o'nta katta devor: koinotdan o'zbek naqshigacha.",
      }[lang],
      cover: img('tashkent-murals', 'cover'),
      intro: {
        en: 'Tashkent has turned dozens of Soviet apartment blocks into an open-air gallery. Most murals are in residential districts, away from the usual sights, so they are a good excuse to ride the metro and see the city locals live in.\n\nTap a mural to open it on the map. Paintings change: some fade, new ones appear every season.',
        ru: 'Ташкент превратил десятки советских многоэтажек в галерею под открытым небом. Большинство муралов — в спальных районах, вдали от привычных достопримечательностей. Хороший повод проехаться на метро и увидеть город, в котором живут местные.\n\nНажмите на мурал, чтобы открыть его на карте. Росписи меняются: какие-то выцветают, новые появляются каждый сезон.',
        uz: "Toshkent o'nlab sovet davri ko'p qavatli uylarini ochiq osmon ostidagi galereyaga aylantirdi. Murallarning aksariyati turar-joy mavzelarida, odatiy diqqatga sazovor joylardan uzoqda. Metroda yurib, mahalliy aholi yashaydigan shaharni ko'rish uchun yaxshi bahona.\n\nXaritada ochish uchun muralni bosing. Rasmlar o'zgaradi: ba'zilari o'chadi, har mavsumda yangilari paydo bo'ladi.",
      }[lang],
      order: 1,
      gallery: [],
      sourceUrl: 'https://t.me/ArtMuralTash',
      sourceLabel: 'Telegram @ArtMuralTash',
      sourceText: {
        en: 'More murals and street art of Tashkent, with exact locations.',
        ru: 'Больше муралов и стрит-арта Ташкента с точными адресами.',
        uz: "Toshkentning ko'proq murallari va stritarti aniq manzillari bilan.",
      }[lang],
      items: MURALS.map((m) => mural(m, lang)),
    },
  ]
}
