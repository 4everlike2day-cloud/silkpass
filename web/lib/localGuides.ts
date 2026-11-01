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

// Метро Ташкента: 13 красивых станций. Фото обработаны ретро-фильтром, лежат в public/guides/tashkent-metro.
// Координаты станций — по Википедии. Линии: синяя O'zbekiston, красная Chilonzor, зелёная Yunusobod.
const LINE: Record<'uzb' | 'chil' | 'yun', L> = {
  uzb: {en: 'Oʻzbekiston line · blue', ru: 'Узбекистанская линия · синяя', uz: "O'zbekiston liniyasi · ko'k"},
  chil: {en: 'Chilonzor line · red', ru: 'Чиланзарская линия · красная', uz: 'Chilonzor liniyasi · qizil'},
  yun: {en: 'Yunusobod line · green', ru: 'Юнусабадская линия · зелёная', uz: 'Yunusobod liniyasi · yashil'},
}
type StationSrc = {n: string; line: keyof typeof LINE; lat: number; lon: number; title: L; text: L}

const STATIONS: StationSrc[] = [
  {
    n: 'beruniy', line: 'uzb', lat: 41.345428, lon: 69.206767,
    title: {en: 'Beruniy', ru: 'Беруни', uz: 'Beruniy'},
    text: {
      en: 'Calm, solemn architecture: a domed ceiling with a marble pattern and hanging chandeliers over the platform. Named after Abu Rayhan al-Biruni, the great scholar-encyclopedist of the medieval East. Look at how symmetry, stone and soft light work together.',
      ru: 'Спокойная, торжественная архитектура: купольная композиция с мраморным рисунком и подвесные люстры над платформой. Название напоминает об Абу Райхане Беруни — выдающемся учёном-энциклопедисте средневекового Востока. Обратите внимание на сочетание симметрии, каменной отделки и мягкого света.',
      uz: "Osoyishta va tantanali me'morchilik: platforma ustida marmar naqshli gumbazsimon shift va osma qandillar. Nomi o'rta asr Sharqining buyuk qomusiy olimi Abu Rayhon Beruniyni eslatadi. Simmetriya, tosh qoplama va yumshoq yorug'lik uyg'unligiga e'tibor bering.",
    },
  },
  {
    n: 'tinchlik', line: 'uzb', lat: 41.331861, lon: 69.219925,
    title: {en: 'Tinchlik', ru: 'Тинчлик', uz: 'Tinchlik'},
    text: {
      en: 'A richly decorated station: coloured glass panels, marble columns and lamps set a rhythm that runs the whole length of the platform. The name means “peace”. A treat for anyone who likes to study interior details.',
      ru: 'Станция с насыщенным декоративным оформлением: цветные витражные поверхности, мраморные колонны и светильники создают ритм вдоль всей платформы. Название переводится как «мир». Интересная остановка для тех, кто любит рассматривать детали интерьеров.',
      uz: "Bezakka boy bekat: rangli vitrajlar, marmar ustunlar va chiroqlar platforma bo'ylab ritm yaratadi. Nomi «tinchlik» degani. Interyer tafsilotlarini tomosha qilishni yaxshi ko'radiganlar uchun qiziqarli bekat.",
    },
  },
  {
    n: 'gafur-gulom', line: 'uzb', lat: 41.327831, lon: 69.246981,
    title: {en: 'Gʻafur Gʻulom', ru: 'Гафур Гулям', uz: "G'afur G'ulom"},
    text: {
      en: 'Massive columns contrast with colourful ceramic panels; turquoise stone and ornament make the hall expressive without overloading it. Named after Gafur Gulam, the 20th-century Uzbek poet and writer.',
      ru: 'Интерьер строится на контрасте массивных колонн и красочных керамических панно. Бирюзовые оттенки камня и орнамент придают залу выразительность, не перегружая его. Станция названа в честь Гафура Гуляма — узбекского поэта и писателя XX века.',
      uz: "Interyer ulkan ustunlar va rang-barang sopol panolar qarama-qarshiligiga qurilgan. Toshning feruza tuslari va naqshlar zalni ortiqcha yuklamasdan ifodali qiladi. Bekat XX asr o'zbek shoiri va yozuvchisi G'afur G'ulom nomi bilan atalgan.",
    },
  },
  {
    n: 'alisher-navoiy', line: 'uzb', lat: 41.321125, lon: 69.254714,
    title: {en: 'Alisher Navoiy', ru: 'Алишер Навои', uz: 'Alisher Navoiy'},
    text: {
      en: 'One of the most recognisable stations in Tashkent. Arches, blue domes and fine ornament echo the historic madrasas and mosques of Uzbekistan, while ceramic panels tell the story of the poet Alisher Navoi. Transfer to Paxtakor.',
      ru: 'Одна из самых узнаваемых станций Ташкента. Арки, синие купольные мотивы и изящный орнамент напоминают исторические медресе и мечети Узбекистана, а керамические панно связаны с наследием поэта Алишера Навои. Здесь переход на «Пахтакор».',
      uz: "Toshkentning eng taniqli bekatlaridan biri. Ravoqlar, ko'k gumbaz naqshlari va nafis bezaklar O'zbekistonning tarixiy madrasa va masjidlarini eslatadi, sopol panolar esa Alisher Navoiy merosi haqida hikoya qiladi. Bu yerda «Paxtakor»ga o'tish bor.",
    },
  },
  {
    n: 'kosmonavtlar', line: 'uzb', lat: 41.305022, lon: 69.265344,
    title: {en: 'Kosmonavtlar', ru: 'Космонавтлар', uz: 'Kosmonavtlar'},
    text: {
      en: 'A station about space. Deep blues fade into darker tones, and a long light line on the ceiling looks like the Milky Way. Ceramic medallions show the heroes of space flight, including Yuri Gagarin and Valentina Tereshkova. One of the most unusual interiors in the metro.',
      ru: 'Станция о космосе. Глубокие синие оттенки переходят в более тёмные, а протяжённый световой элемент на потолке напоминает Млечный Путь. Керамические медальоны посвящены героям космонавтики — среди них Юрий Гагарин и Валентина Терешкова. Один из самых необычных интерьеров ташкентского метро.',
      uz: "Koinot haqidagi bekat. Chuqur ko'k ranglar to'qroq tuslarga o'tadi, shiftdagi uzun yorug'lik chizig'i esa Somon yo'lini eslatadi. Sopol medalyonlar kosmonavtika qahramonlariga bag'ishlangan, ular orasida Yuriy Gagarin va Valentina Tereshkova bor. Toshkent metrosining eng g'ayrioddiy interyerlaridan biri.",
    },
  },
  {
    n: 'tashkent', line: 'uzb', lat: 41.292136, lon: 69.28615,
    title: {en: 'Toshkent', ru: 'Ташкент', uz: 'Toshkent'},
    text: {
      en: 'Dedicated to the history and image of the capital, with blue-and-white ceramic panels about city life and Uzbek heritage. A good example of how the metro uses art to tell the story of the city, not just to move passengers. Next to the main railway station.',
      ru: 'Станция посвящена истории и образу столицы: керамические панно в сине-белой гамме, композиции о городской жизни и наследии Узбекистана. Хороший пример того, как метро рассказывает о городе, а не только перевозит пассажиров. Рядом главный железнодорожный вокзал.',
      uz: "Bekat poytaxt tarixi va qiyofasiga bag'ishlangan: ko'k-oq sopol panolar, shahar hayoti va O'zbekiston merosi haqidagi kompozitsiyalar. Metro yo'lovchi tashishdan tashqari shahar haqida ham hikoya qilishiga yaxshi misol. Yonida asosiy temir yo'l vokzali.",
    },
  },
  {
    n: 'chilonzor', line: 'chil', lat: 41.274547, lon: 69.204739,
    title: {en: 'Chilonzor', ru: 'Чиланзар', uz: 'Chilonzor'},
    text: {
      en: 'Part of the very first section of the Tashkent metro, opened in 1977. Colourful ceramic panels and huge chandeliers; less obvious symbolism than elsewhere, but you can feel the monumental style of the early metro: rich materials, big scale and careful symmetry.',
      ru: 'Входит в первый участок ташкентского метро, открытый в 1977 году. Цветные керамические панно и крупные светильники. Тематической символики меньше, чем на других станциях, зато хорошо ощущается монументальный стиль раннего метро: выразительные материалы, крупный масштаб и выверенная симметрия.',
      uz: "1977 yilda ochilgan Toshkent metrosining birinchi qismiga kiradi. Rangli sopol panolar va katta qandillar. Ramziy bezaklar boshqa bekatlardagidan kamroq, lekin ilk metroning monumental uslubi yaxshi seziladi: ifodali materiallar, katta ko'lam va puxta simmetriya.",
    },
  },
  {
    n: 'xalqlar-dostligi', line: 'chil', lat: 41.311881, lon: 69.241392,
    title: {en: 'Xalqlar Doʻstligi', ru: 'Халклар дустлиги', uz: "Xalqlar do'stligi"},
    text: {
      en: 'A restrained, strict station: a clear rhythm of columns and laconic geometry create a sense of space and order. The name means “Friendship of Peoples”. In 2008–2018 it was called Bunyodkor, after the football club, and then got its historic name back.',
      ru: 'Сдержанная, строгая станция: чёткий ритм колонн и лаконичная геометрия создают ощущение простора и порядка. Название переводится как «Дружба народов». В 2008–2018 годах станция называлась «Бунёдкор», в честь футбольного клуба, а затем ей вернули историческое имя.',
      uz: "Vazmin va qat'iy bekat: ustunlarning aniq ritmi va lo'nda geometriya kenglik va tartib hissini beradi. 2008–2018 yillarda bekat futbol klubi sharafiga «Bunyodkor» deb atalgan, keyin unga tarixiy nomi qaytarilgan.",
    },
  },
  {
    n: 'paxtakor', line: 'chil', lat: 41.321264, lon: 69.254325,
    title: {en: 'Paxtakor', ru: 'Пахтакор', uz: 'Paxtakor'},
    text: {
      en: 'The main motif is the cotton plant: blue-green mosaics with plant forms recall the crop that shaped Uzbekistan’s economy and daily life for decades. The name means “cotton grower”. Linked by a passage to Alisher Navoiy, so it is easy to add to an art-metro walk.',
      ru: 'Главный мотив — хлопчатник: сине-зелёные мозаики с растительными формами отсылают к культуре, которая долго определяла экономику и повседневную жизнь Узбекистана. Название переводится как «хлопкороб». Станция соединена переходом с «Алишер Навои», её удобно включить в маршрут.',
      uz: "Asosiy naqsh — g'o'za: o'simlik shakllaridagi ko'k-yashil mozaikalar uzoq yillar O'zbekiston iqtisodiyoti va kundalik hayotini belgilagan ekinga ishora qiladi. Bekat «Alisher Navoiy» bilan o'tish yo'li orqali bog'langan, uni yo'nalishga qo'shish qulay.",
    },
  },
  {
    n: 'mustaqillik-maydoni', line: 'chil', lat: 41.318925, lon: 69.271292,
    title: {en: 'Mustaqillik Maydoni', ru: 'Мустакиллик майдони', uz: 'Mustaqillik maydoni'},
    text: {
      en: 'Independence Square, one of the grandest stations of the old metro. Light stone, columns and a carefully built perspective give the hall a ceremonial look. Look down at the floor pattern and at how the stone plays with light. The square itself is right above.',
      ru: '«Площадь Независимости» — одна из самых представительных станций старой части метро. Светлый камень, колонны и выстроенная перспектива придают залу торжественный вид. Рассмотрите рисунок пола и игру камня со светом. Сама площадь — прямо над станцией.',
      uz: "Eski metroning eng salobatli bekatlaridan biri. Och rangli tosh, ustunlar va puxta qurilgan istiqbol zalga tantanali tus beradi. Pol naqshi va toshning yorug'lik bilan o'yiniga e'tibor bering. Maydonning o'zi bekat tepasida.",
    },
  },
  {
    n: 'yunus-rajabi', line: 'yun', lat: 41.312311, lon: 69.281042,
    title: {en: 'Yunus Rajabiy', ru: 'Юнус Раджаби', uz: 'Yunus Rajabiy'},
    text: {
      en: 'Named after the famous Uzbek musician and collector of musical heritage. Big marble columns and a wide staircase, the architectural centrepiece of the hall. Transfer to Amir Temur Xiyoboni.',
      ru: 'Станция посвящена известному узбекскому музыканту и собирателю музыкального наследия. Пространство подчёркивают крупные мраморные колонны и широкая лестница — главный архитектурный акцент зала. Пересадка на «Амир Темур хиёбони».',
      uz: "Bekat mashhur o'zbek musiqachisi va musiqa merosini to'plovchisiga bag'ishlangan. Katta marmar ustunlar va keng zinapoya zalning asosiy me'moriy urg'usi. «Amir Temur xiyoboni»ga o'tish bor.",
    },
  },
  {
    n: 'abdulla-qodiriy', line: 'yun', lat: 41.319411, lon: 69.282458,
    title: {en: 'Abdulla Qodiriy', ru: 'Абдулла Кадыри', uz: 'Abdulla Qodiriy'},
    text: {
      en: 'A symmetrical platform hall with colourful inlays on the columns; the mix of cool and warm tones makes it stand out, though it is calmer than the most lavish stations. Named after Abdulla Qodiriy, one of the founders of modern Uzbek literature.',
      ru: 'Симметричный платформенный зал и цветные вставки в отделке колонн. Сочетание холодных и тёплых оттенков делает интерьер заметным, хотя он сдержаннее самых пышных станций. Названа в честь Абдуллы Кадыри — одного из ключевых авторов современной узбекской литературы.',
      uz: "Simmetrik platforma zali va ustunlar bezagidagi rangli qo'shimchalar. Sovuq va iliq tuslar uyg'unligi interyerni ko'zga tashlanadigan qiladi, garchi u eng hashamatli bekatlardan vazminroq bo'lsa ham. Zamonaviy o'zbek adabiyotining asoschilaridan biri Abdulla Qodiriy nomi bilan atalgan.",
    },
  },
  {
    n: 'bodomzor', line: 'yun', lat: 41.3462, lon: 69.28595,
    title: {en: 'Bodomzor', ru: 'Бодомзор', uz: 'Bodomzor'},
    text: {
      en: 'A light ceiling with blue geometric patterns, small ceramic details and modern lamps. The repeating shapes feel almost futuristic, and warm light softens the strict geometry. Opened in 2001; the network has grown a lot since.',
      ru: 'Светлый потолок с синими геометрическими узорами, небольшие керамические детали и современные светильники. Повторяющиеся формы придают станции почти футуристический характер, а тёплый свет смягчает строгую геометрию. Открыта в 2001 году; с тех пор сеть сильно выросла.',
      uz: "Ko'k geometrik naqshli och rangli shift, kichik sopol bezaklar va zamonaviy chiroqlar. Takrorlanuvchi shakllar bekatga deyarli futuristik ko'rinish beradi, iliq yorug'lik esa qat'iy geometriyani yumshatadi. 2001 yilda ochilgan; o'shandan beri tarmoq ancha kengaydi.",
    },
  },
]

function station(s: StationSrc, lang: Lang): GuideItem {
  const photo = img('tashkent-metro', s.n)
  return {
    title: s.title[lang], text: s.text[lang], image: photo, images: [photo],
    mapsUrl: yandex(s.lat, s.lon), lat: s.lat, lon: s.lon, area: LINE[s.line][lang], credit: null,
  }
}


// «Где поесть» в каждом городе: /<город>/eat. Сюда ведут QR со страниц печатей партнёров в паспорте.
// Пока партнёров нет — заглушка и ссылка на форму для заведений.
const EAT: {city: string; order: number; name: L; plov: L}[] = [
  {city: 'tashkent', order: 2, name: {en: 'Tashkent', ru: 'Ташкенте', uz: 'Toshkentda'},
    plov: {
      en: "Tashkent's signature is to'y oshi, the wedding plov: two kinds of carrots, Laser rice, gentle frying and rich festive toppings.",
      ru: 'Визитная карточка Ташкента — тўй оши, праздничный плов: два вида моркови, рис «Лазер», мягкая обжарка и богатые праздничные топпинги.',
      uz: "Toshkentning o'ziga xos taomi — to'y oshi: ikki xil sabzi, «Lazer» guruchi, yumshoq qovurish va bayramona bezaklar.",
    }},
  {city: 'samarkand', order: 2, name: {en: 'Samarkand', ru: 'Самарканде', uz: 'Samarqandda'},
    plov: {
      en: 'Samarkand plov is cooked in layers and never stirred: light and mild, with big pieces of meat, yellow carrots, chickpeas and raisins.',
      ru: 'Самаркандский плов готовят слоями и не перемешивают: светлый и мягкий, с крупными кусками мяса, жёлтой морковью, нутом и изюмом.',
      uz: "Samarqand oshi qatlamlab pishiriladi va aralashtirilmaydi: och rang, yengil ta'm, yirik go'sht, sariq sabzi, no'xat va mayiz.",
    }},
  {city: 'bukhara', order: 2, name: {en: 'Bukhara', ru: 'Бухаре', uz: 'Buxoroda'},
    plov: {
      en: 'Try oshi sofi, the “pure plov” or plov of the wise: layers cooked separately, no frying at all, a copper kazan and saffron.',
      ru: 'Попробуйте оши-софи — «чистый плов», или «плов мудрецов»: слои готовят отдельно, совсем без жарки, в медном казане, с шафраном.',
      uz: "Oshi sofini tatib ko'ring — «toza osh», donishmandlar oshi: qatlamlar alohida, qovurmasdan, mis qozonda, za'faron bilan.",
    }},
  {city: 'khiva', order: 2, name: {en: 'Khiva', ru: 'Хиве', uz: 'Xivada'},
    plov: {
      en: 'Khorezm chalov has few spices and a clean taste: carrots cut the local way, meat slowly stewed in water, local rice. Also try shivit oshi, green dill noodles.',
      ru: 'Хорезмский чалов — минимум специй и чистый вкус: особая нарезка моркови, мясо долго томится в воде, местный рис. Попробуйте и шивит оши — зелёную лапшу с укропом.',
      uz: "Xorazm chalovi — kam ziravor va toza ta'm: sabzi o'ziga xos to'g'raladi, go'sht suvda uzoq dimlanadi, mahalliy guruch. Shivit oshini ham tatib ko'ring.",
    }},
]

function eatGuide(e: (typeof EAT)[number], lang: Lang): Guide {
  return {
    slug: 'eat',
    citySlug: e.city,
    title: {en: `Where to eat in ${e.name.en}`, ru: `Где поесть в ${e.name.ru}`, uz: `${e.name.uz} qayerda ovqatlanish mumkin`}[lang],
    summary: {
      en: 'Local plov and partner cafés with their own passport stamp.',
      ru: 'Местный плов и кафе-партнёры со своей печатью для паспорта.',
      uz: "Mahalliy osh va pasport uchun o'z muhriga ega hamkor kafelar.",
    }[lang],
    cover: null,
    intro: `${e.plov[lang]}\n\n${{
      en: 'Here we will list partner cafés, teahouses and workshops. Each one has its own round or triangle stamp for the partner pages of your passport.',
      ru: 'Здесь появятся кафе, чайханы и мастерские наших партнёров. У каждого — своя круглая или треугольная печать для страниц партнёров в паспорте.',
      uz: "Bu yerda hamkor kafelar, choyxonalar va ustaxonalar ro'yxati paydo bo'ladi. Har birining pasportdagi hamkorlar sahifasi uchun o'z dumaloq yoki uchburchak muhri bor.",
    }[lang]}`,
    order: e.order,
    gallery: [],
    items: [],
    note: {
      title: {en: 'Partners coming soon', ru: 'Партнёры скоро появятся', uz: "Hamkorlar tez orada paydo bo'ladi"}[lang],
      text: {
        en: 'We are choosing the first places right now. Keep the partner page of your passport free: the stamps are on their way.',
        ru: 'Мы как раз выбираем первые места. Оставьте страницу партнёров в паспорте свободной: печати уже в пути.',
        uz: "Hozir birinchi joylarni tanlayapmiz. Pasportdagi hamkorlar sahifasini bo'sh qoldiring: muhrlar yo'lda.",
      }[lang],
    },
    cta: {
      label: {en: 'For cafés and restaurants', ru: 'Для кафе и ресторанов', uz: 'Kafe va restoranlar uchun'}[lang],
      title: {
        en: 'Want your place on this page and your stamp in the passport?',
        ru: 'Хотите, чтобы ваше заведение было здесь, а его печать — в паспорте?',
        uz: "Joyingiz shu sahifada, muhringiz esa pasportda bo'lishini xohlaysizmi?",
      }[lang],
      button: {en: 'Become a partner', ru: 'Стать партнёром', uz: "Hamkor bo'lish"}[lang],
      path: '/partners#apply',
    },
  }
}

export function localGuides(lang: Lang): Guide[] {
  const ATTO = `https://atto.uz/${lang}`
  const METRO = `https://uzmetro.uz/${lang}`
  return [
    {
      slug: 'metro',
      citySlug: 'tashkent',
      title: {en: 'Tashkent Metro', ru: 'Метро Ташкента', uz: 'Toshkent metrosi'}[lang],
      summary: {
        en: 'Thirteen underground palaces: marble, ceramics, chandeliers and even outer space.',
        ru: 'Тринадцать подземных дворцов: мрамор, керамика, люстры и даже космос.',
        uz: "O'n uchta yer osti saroyi: marmar, sopol, qandillar va hatto koinot.",
      }[lang],
      cover: img('tashkent-metro', 'cover'),
      intro: {
        en: 'The Tashkent Metro is more than transport: it is an underground gallery of architecture and decorative art. Marble and granite, colourful ceramics, mosaics, stained glass and striking chandeliers. Every station has its own character: some look like an Eastern palace, others tell stories about space, literature or the history of the capital.\n\nWe picked 13 of the most beautiful stations. Tap a station on the map to see its photo, and check the scheme before you go: the network keeps growing. Taking photos in the metro has been allowed since 2018; just follow the staff’s instructions.',
        ru: 'Ташкентское метро — не только удобный транспорт, но и подземная галерея архитектуры и декоративного искусства. Мрамор и гранит, цветная керамика, мозаики, витражи и выразительные светильники. У каждой станции свой характер: одни напоминают восточный дворец, другие рассказывают о космосе, литературе или истории столицы.\n\nМы выбрали 13 самых красивых станций. Нажмите на станцию на карте, чтобы увидеть фото, а перед поездкой сверьтесь со схемой: сеть постоянно растёт. Фотографировать в метро можно с 2018 года, просто следуйте указаниям сотрудников.',
        uz: "Toshkent metrosi nafaqat qulay transport, balki me'morchilik va bezak san'atining yer osti galereyasi hamdir. Marmar va granit, rangli sopol, mozaika, vitraj va ko'zni qamashtiruvchi chiroqlar. Har bir bekatning o'z xarakteri bor: ba'zilari sharq saroyini eslatadi, boshqalari koinot, adabiyot yoki poytaxt tarixi haqida hikoya qiladi.\n\nBiz eng chiroyli 13 ta bekatni tanladik. Suratni ko'rish uchun xaritada bekatni bosing, safardan oldin esa sxemani tekshiring: tarmoq doimo kengaymoqda. Metroda 2018 yildan beri suratga olish mumkin, faqat xodimlarning ko'rsatmalariga amal qiling.",
      }[lang],
      scheme: {
        image: '/guides/tashkent-metro/scheme.webp',
        alt: {en: 'Tashkent Metro map', ru: 'Схема метро Ташкента', uz: 'Toshkent metrosi sxemasi'}[lang],
        credit: {en: 'Map by Ilya Birman and Timur Repin', ru: 'Схема: Илья Бирман, Тимур Репин', uz: 'Sxema mualliflari: Ilya Birman, Timur Repin'}[lang],
        creditUrl: 'https://ilyabirman.ru/tashkent-metro/map-1/',
        downloadUrl: 'https://ilyabirman.ru/tashkent-metro/map-1/download/tashkent-metro-map-2024-1.pdf',
        downloadLabel: {en: 'Download PDF', ru: 'Скачать PDF', uz: 'PDF yuklab olish'}[lang],
      },
      tips: {
        title: {en: 'Rider’s cheat sheet', ru: 'Шпаргалка пассажира', uz: "Yo'lovchi uchun eslatma"}[lang],
        items: {
          en: [
            `Fare: tap a contactless bank card or an [ATTO](${ATTO}) card at the turnstile — 2,500 so'm per trip. Cash: a QR ticket from the ticket office, 3,000 so'm (as of 1 October 2026).`,
            'Your foreign card works too: turnstiles accept Visa, Mastercard and UnionPay, plus local Uzcard and Humo (as of March 2026).',
            `Hours: 5:00–24:00; the green Yunusobod line runs 6:00–23:00. Entrances close 15 minutes earlier (as of March 2026). Up-to-date info: [uzmetro.uz](${METRO}).`,
            'For empty platforms and photos, avoid rush hours: 7:30–9:30 and 17:00–19:00.',
            'Large luggage (over 200 cm in total) needs a separate ticket.',
            'Station Wi-Fi works only with a local SIM card.',
          ],
          ru: [
            `Оплата: приложите бесконтактную банковскую карту или карту [ATTO](${ATTO}) к турникету — 2 500 сумов за поездку. Наличными: QR-билет в кассе, 3 000 сумов (на 1 октября 2026).`,
            'Иностранная карта тоже подойдёт: турникеты принимают Visa, Mastercard и UnionPay, а также местные Uzcard и Humo (на март 2026).',
            `Часы работы: 5:00–24:00, зелёная Юнусабадская линия — 6:00–23:00. Вход закрывают за 15 минут до конца (на март 2026). Актуальное — на [uzmetro.uz](${METRO}).`,
            'Для пустых платформ и фото избегайте часа пик: 7:30–9:30 и 17:00–19:00.',
            'Крупный багаж (больше 200 см по сумме трёх сторон) оплачивается отдельно.',
            'Wi-Fi на станциях работает только с местной SIM-картой.',
          ],
          uz: [
            `To'lov: turniketga kontaktsiz bank kartasi yoki [ATTO](${ATTO}) kartasini tekkizing — bir yo'l 2 500 so'm. Naqd: kassada QR-chipta, 3 000 so'm (2026-yil 1-oktabr holatiga).`,
            "Xorijiy karta ham ishlaydi: turniketlar Visa, Mastercard, UnionPay hamda mahalliy Uzcard va Humo kartalarini qabul qiladi (2026-yil mart holatiga).",
            `Ish vaqti: 5:00–24:00, yashil Yunusobod liniyasi — 6:00–23:00. Kirish 15 daqiqa oldin yopiladi (2026-yil mart holatiga). Dolzarb ma'lumot: [uzmetro.uz](${METRO}).`,
            "Bo'sh platformalar va suratlar uchun tig'iz soatlardan qoching: 7:30–9:30 va 17:00–19:00.",
            "Katta yuk (uch tomoni yig'indisi 200 sm dan ortiq) alohida to'lanadi.",
            "Bekatlardagi Wi-Fi faqat mahalliy SIM-karta bilan ishlaydi.",
          ],
        }[lang],
      },
      note: {
        title: {en: 'See the real colours yourself', ru: 'Настоящие цвета — только вживую', uz: "Haqiqiy ranglarni o'zingiz ko'ring"}[lang],
        text: {
          en: 'All photos on this page went through a retro filter. The real shine of the marble, the glow of the chandeliers and the colours of the mosaics can only be seen underground. Your challenge: find all 13 stations and decide which one is the most beautiful.',
          ru: 'Все фотографии на этой странице обработаны ретро-фильтром. Настоящий блеск мрамора, свет люстр и цвета мозаик можно увидеть только под землёй. Ваш челлендж: найдите все 13 станций и решите, какая из них самая красивая.',
          uz: "Bu sahifadagi barcha suratlar retro filtr bilan ishlangan. Marmarning haqiqiy jilosi, qandillar nuri va mozaika ranglarini faqat yer ostida ko'rish mumkin. Sizning sinovingiz: barcha 13 ta bekatni toping va qaysi biri eng chiroyli ekanini hal qiling.",
        }[lang],
      },
      order: 0,
      gallery: [],
      sourceUrl: 'https://www.afisha.uz/ru/gorod/2016/01/28/metro',
      sourceLabel: 'Afisha.uz',
      sourceText: {
        en: 'More photos of Tashkent metro stations from Afisha.uz (in Russian).',
        ru: 'Ещё больше фотографий станций ташкентского метро — в подборке Afisha.uz.',
        uz: "Toshkent metro bekatlarining ko'proq suratlari — Afisha.uz to'plamida (rus tilida).",
      }[lang],
      items: STATIONS.map((s) => station(s, lang)),
    },
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
    ...EAT.map((e) => eatGuide(e, lang)),
  ]
}
