// Переводы базового контента из Sanity (города, места, кухня, FAQ, магазин).
// Как работает: если в Sanity у поля нет русской/узбекской версии, сайт получает английский текст.
// Если этот английский текст есть в таблице ниже, показывается перевод отсюда.
// Если вы впишете перевод в Sanity, он будет важнее этой таблицы.
type Tr = {ru: string; uz: string}

export const CONTENT_TR: Record<string, Tr> = {
  // Настройки
  'Collect Uzbekistan, one stamp at a time.': {
    ru: 'Соберите Узбекистан, штамп за штампом.',
    uz: "O'zbekistonni yig'ing: har shaharda bir muhr.",
  },
  'A pocket passport for the classic route: Tashkent, Samarkand, Bukhara and Khiva. Get an original stamp in every city and take the whole trip home in your pocket.': {
    ru: 'Карманный паспорт для классического маршрута: Ташкент, Самарканд, Бухара и Хива. Получите оригинальный штамп в каждом городе и увезите всю поездку с собой.',
    uz: "Mumtoz yo'nalish uchun cho'ntak pasporti: Toshkent, Samarqand, Buxoro va Xiva. Har bir shaharda original muhr oling va butun safarni uyga olib keting.",
  },
  'Collect all four stamps and show the passport at any stamp point to get the Route complete stamp and a gift.': {
    ru: 'Соберите все четыре штампа и покажите паспорт в любой точке штампа, чтобы получить штамп Route complete и подарок.',
    uz: "To'rttala muhrni yig'ing va pasportni istalgan muhr nuqtasida ko'rsating: Route complete muhri va sovg'a olasiz.",
  },
  'Collect all four stamps and show the full passport at the Khiva stamp point to claim your reward.': {
    ru: 'Соберите все четыре штампа и покажите паспорт в любой точке штампа, чтобы получить штамп Route complete и подарок.',
    uz: "To'rttala muhrni yig'ing va pasportni istalgan muhr nuqtasida ko'rsating: Route complete muhri va sovg'a olasiz.",
  },

  // Города
  Tashkent: {ru: 'Ташкент', uz: 'Toshkent'},
  Samarkand: {ru: 'Самарканд', uz: 'Samarqand'},
  Bukhara: {ru: 'Бухара', uz: 'Buxoro'},
  Khiva: {ru: 'Хива', uz: 'Xiva'},

  // Ташкент
  'The capital and your gateway. Most international flights land here, so this is where the route begins. Soviet-era boulevards, a metro that doubles as a gallery, and the busiest bazaar in the country.': {
    ru: 'Столица и ворота страны. Большинство международных рейсов прилетает сюда, поэтому маршрут начинается здесь. Советские бульвары, метро, похожее на галерею, и самый оживлённый базар страны.',
    uz: "Poytaxt va mamlakat darvozasi. Xalqaro reyslarning aksariyati shu yerga qo'nadi, shuning uchun yo'nalish shu yerdan boshlanadi. Sovet davri xiyobonlari, galereyaga o'xshash metro va mamlakatdagi eng gavjum bozor.",
  },
  'Afrosiyob high-speed train · about 2 h 15 min': {ru: 'Скоростной поезд Afrosiyob · около 2 ч 15 мин', uz: 'Afrosiyob tezyurar poyezdi · taxminan 2 soat 15 daqiqa'},
  'Hazrati Imam complex': {ru: 'Комплекс Хазрати Имам', uz: 'Hazrati Imom majmuasi'},
  "Old-city religious centre, home to one of the oldest surviving Qur'an manuscripts.": {
    ru: 'Религиозный центр старого города, где хранится один из древнейших сохранившихся списков Корана.',
    uz: "Eski shaharning diniy markazi. Bu yerda saqlanib qolgan eng qadimiy Qur'on qo'lyozmalaridan biri bor.",
  },
  'Chorsu Bazaar': {ru: 'Базар Чорсу', uz: 'Chorsu bozori'},
  'Blue domed market. Come in the morning for bread, dried fruit and spices.': {
    ru: 'Рынок под синим куполом. Приходите утром за лепёшками, сухофруктами и специями.',
    uz: "Ko'k gumbazli bozor. Non, quruq meva va ziravorlar uchun ertalab keling.",
  },
  'Tashkent Metro': {ru: 'Ташкентское метро', uz: 'Toshkent metrosi'},
  'Every station is decorated differently. Kosmonavtlar and Alisher Navoiy are the stand-outs.': {
    ru: 'Каждая станция оформлена по-своему. Особенно хороши «Космонавтлар» и «Алишер Навои».',
    uz: "Har bir bekat o'zgacha bezatilgan. Ayniqsa Kosmonavtlar va Alisher Navoiy bekatlari ajoyib.",
  },
  'Amir Timur Square': {ru: 'Площадь Амира Темура', uz: 'Amir Temur xiyoboni'},
  'The modern centre of the city, next to the Hotel Uzbekistan and the Timurid Museum.': {
    ru: 'Современный центр города рядом с гостиницей «Узбекистан» и Музеем Темуридов.',
    uz: "Shaharning zamonaviy markazi, «O'zbekiston» mehmonxonasi va Temuriylar muzeyi yonida.",
  },
  'Minor Mosque': {ru: 'Мечеть Минор', uz: 'Minor masjidi'},
  'White marble mosque on the Ankhor canal, especially photogenic at sunset.': {
    ru: 'Мечеть из белого мрамора на канале Анхор, особенно красивая на закате.',
    uz: "Anhor kanali bo'yidagi oq marmar masjid, ayniqsa quyosh botishida chiroyli.",
  },
  'Museum of Applied Arts': {ru: 'Музей прикладного искусства', uz: "Amaliy san'at muzeyi"},
  "A merchant's mansion filled with carved wood, ganch plaster and suzani embroidery.": {
    ru: 'Особняк купца с резьбой по дереву, ганчем и вышивкой сюзане.',
    uz: "Yog'och o'ymakorligi, ganch va so'zana kashtalari bilan bezatilgan savdogar uyi.",
  },
  'Plov at lunchtime: it is traditionally served until early afternoon': {
    ru: 'Плов в обед: по традиции его подают до начала второй половины дня',
    uz: "Tushlikda palov: an'anaga ko'ra u kunning birinchi yarmida tortiladi",
  },
  'Samsa from a tandir oven': {ru: 'Самса из тандыра', uz: 'Tandir somsa'},
  'Green tea everywhere, served in a piala bowl': {ru: 'Зелёный чай повсюду, в пиале', uz: "Hamma joyda piyolada ko'k choy"},

  // Самарканд
  "Timur's capital and the most famous view in Central Asia. Three madrasahs facing one square, turquoise domes and a necropolis of tiled mausoleums.": {
    ru: 'Столица Тимура и самый знаменитый вид Центральной Азии. Три медресе на одной площади, бирюзовые купола и некрополь из изразцовых мавзолеев.',
    uz: "Temurning poytaxti va Markaziy Osiyodagi eng mashhur manzara. Bir maydonga qaragan uchta madrasa, feruza gumbazlar va koshinli maqbaralar majmuasi.",
  },
  'Afrosiyob high-speed train · about 1 h 30 min': {ru: 'Скоростной поезд Afrosiyob · около 1 ч 30 мин', uz: 'Afrosiyob tezyurar poyezdi · taxminan 1 soat 30 daqiqa'},
  Registan: {ru: 'Регистан', uz: 'Registon'},
  'Three madrasahs around one square. Visit twice: in daylight and for the evening lights.': {
    ru: 'Три медресе вокруг одной площади. Приходите дважды: днём и вечером, когда зажигается подсветка.',
    uz: "Bir maydon atrofida uchta madrasa. Ikki marta keling: kunduzi va kechki chiroqlar yonganda.",
  },
  'Gur-e-Amir': {ru: 'Гур-Эмир', uz: "Go'ri Amir"},
  'The mausoleum of Amir Timur, with a ribbed azure dome and gilded interior.': {
    ru: 'Мавзолей Амира Темура с ребристым лазурным куполом и позолоченным интерьером.',
    uz: "Amir Temur maqbarasi: qovurg'ali moviy gumbaz va zarhal ichki bezak.",
  },
  'Shah-i-Zinda': {ru: 'Шахи-Зинда', uz: 'Shohi Zinda'},
  'An avenue of tiled tombs, the finest majolica in the country.': {
    ru: 'Улица изразцовых гробниц с лучшей майоликой страны.',
    uz: "Koshinli maqbaralar ko'chasi, mamlakatdagi eng nafis majolika.",
  },
  'Bibi-Khanym Mosque': {ru: 'Мечеть Биби-Ханым', uz: 'Bibixonim masjidi'},
  'Once one of the largest mosques in the Islamic world.': {ru: 'Когда-то одна из крупнейших мечетей исламского мира.', uz: 'Bir paytlar Islom olamidagi eng katta masjidlardan biri.'},
  'Siyob Bazaar': {ru: 'Сиабский базар', uz: 'Siyob bozori'},
  'Right next to Bibi-Khanym. Buy Samarkand non, the famous round bread.': {
    ru: 'Рядом с Биби-Ханым. Купите знаменитую самаркандскую лепёшку.',
    uz: 'Bibixonim yonida. Mashhur Samarqand nonini oling.',
  },
  'Ulugh Beg Observatory': {ru: 'Обсерватория Улугбека', uz: "Ulug'bek rasadxonasi"},
  'Remains of a 15th-century observatory and its giant meridian arc.': {
    ru: 'Остатки обсерватории XV века и её огромной меридианной дуги.',
    uz: 'XV asr rasadxonasi qoldiqlari va uning ulkan meridian yoyi.',
  },
  'Samarkand plov, cooked with yellow carrots': {ru: 'Самаркандский плов с жёлтой морковью', uz: 'Sariq sabzili Samarqand oshi'},
  'Fresh Samarkand non straight from the bazaar': {ru: 'Свежая самаркандская лепёшка прямо с базара', uz: "Bozordan to'g'ri kelgan issiq Samarqand noni"},
  'Shashlik in the evening': {ru: 'Шашлык вечером', uz: 'Kechqurun shashlik'},

  // Бухара
  'A living old town where you walk everywhere. Trading domes, a 12th-century minaret and a citadel that ruled the emirate.': {
    ru: 'Живой старый город, который обходят пешком. Торговые купола, минарет XII века и цитадель, откуда правили эмиратом.',
    uz: "Hamma joyga piyoda boriladigan tirik eski shahar. Savdo gumbazlari, XII asr minorasi va amirlikni boshqargan qal'a.",
  },
  'Train or car · about 6–7 h. Start early in the morning.': {ru: 'Поезд или машина · около 6–7 ч. Выезжайте рано утром.', uz: "Poyezd yoki mashina · taxminan 6–7 soat. Ertalab erta yo'lga chiqing."},
  'Poi Kalyan': {ru: 'Пои-Калян', uz: 'Poi Kalon'},
  "The Kalyan Minaret and mosque, Bukhara's symbol since 1127.": {ru: 'Минарет и мечеть Калян, символ Бухары с 1127 года.', uz: "Kalon minorasi va masjidi, 1127-yildan beri Buxoro ramzi."},
  'Ark Fortress': {ru: 'Крепость Арк', uz: "Ark qal'asi"},
  'The citadel of the Bukhara emirs, with museums inside its walls.': {ru: 'Цитадель бухарских эмиров с музеями внутри стен.', uz: "Buxoro amirlarining qal'asi, devorlari ichida muzeylar bor."},
  'Lyabi-Hauz': {ru: 'Ляби-Хауз', uz: 'Labi Hovuz'},
  'A pool shaded by old mulberry trees. The evening meeting point of the old town.': {
    ru: 'Водоём в тени старых шелковиц. Вечернее место встреч старого города.',
    uz: "Qadimiy tut daraxtlari soyasidagi hovuz. Eski shaharning kechki uchrashuv joyi.",
  },
  'Trading domes': {ru: 'Торговые купола', uz: 'Savdo gumbazlari'},
  'Covered bazaars for jewellers, hat-makers and money-changers.': {ru: 'Крытые базары ювелиров, шапочников и менял.', uz: "Zargarlar, do'ppido'zlar va sarroflar uchun yopiq bozorlar."},
  'Samanid Mausoleum': {ru: 'Мавзолей Саманидов', uz: 'Somoniylar maqbarasi'},
  'A 10th-century brick masterpiece in a quiet park.': {ru: 'Кирпичный шедевр X века в тихом парке.', uz: "Sokin bog'dagi X asrga oid g'isht durdonasi."},
  'Chor Minor': {ru: 'Чор-Минор', uz: 'Chor Minor'},
  'A small gatehouse with four turquoise towers, hidden in the side streets.': {
    ru: 'Небольшие ворота с четырьмя бирюзовыми башенками, спрятанные в переулках.',
    uz: "Tor ko'chalarda yashiringan, to'rtta feruza minorali kichik darvozaxona.",
  },
  'Tea by Lyabi-Hauz in the evening': {ru: 'Вечерний чай у Ляби-Хауза', uz: 'Kechqurun Labi Hovuz bo\'yida choy'},
  'Bukhara plov': {ru: 'Бухарский плов', uz: 'Buxoro oshi'},
  'Halva and sweets from the trading domes': {ru: 'Халва и сладости из торговых куполов', uz: 'Savdo gumbazlaridan holva va shirinliklar'},

  // Хива
  'The last stamp. Itchan Kala is a whole walled city of minarets, palaces and mosques, best explored on foot at sunrise and sunset.': {
    ru: 'Последний штамп. Ичан-Кала — целый город за стенами: минареты, дворцы и мечети. Лучше всего гулять пешком на рассвете и закате.',
    uz: "Oxirgi muhr. Ichan qal'a devorlar ichidagi butun bir shahar: minoralar, saroylar va masjidlar. Uni tong va shom paytida piyoda aylanish yaxshi.",
  },
  'Itchan Kala': {ru: 'Ичан-Кала', uz: "Ichan qal'a"},
  'The walled inner city, a UNESCO World Heritage site. One ticket covers most sights.': {
    ru: 'Внутренний город за стенами, объект Всемирного наследия ЮНЕСКО. Один билет на большинство достопримечательностей.',
    uz: "Devor bilan o'ralgan ichki shahar, YUNESKO Jahon merosi obyekti. Bitta chipta ko'pchilik joylarga amal qiladi.",
  },
  'Kalta Minor': {ru: 'Кальта-Минор', uz: 'Kalta Minor'},
  "The unfinished turquoise minaret, Khiva's best-known landmark.": {ru: 'Недостроенный бирюзовый минарет, самый узнаваемый символ Хивы.', uz: 'Qurilishi tugallanmagan feruza minora, Xivaning eng mashhur ramzi.'},
  'Islam Khoja Minaret': {ru: 'Минарет Ислам-Ходжа', uz: "Islom Xo'ja minorasi"},
  'The tallest minaret in Khiva. Climb it for a view over the whole old town.': {
    ru: 'Самый высокий минарет Хивы. Поднимитесь, чтобы увидеть весь старый город.',
    uz: "Xivadagi eng baland minora. Butun eski shaharni ko'rish uchun tepaga chiqing.",
  },
  'Kunya-Ark': {ru: 'Куня-Арк', uz: "Ko'hna Ark"},
  'The old fortress with a watchtower made for sunset photos.': {ru: 'Старая крепость со сторожевой башней — идеальное место для фото на закате.', uz: "Quyosh botishini suratga olish uchun qulay kuzatuv minorali eski qal'a."},
  'Juma Mosque': {ru: 'Джума-мечеть', uz: 'Juma masjidi'},
  'A prayer hall supported by more than 200 carved wooden columns.': {ru: 'Молитвенный зал на более чем 200 резных деревянных колоннах.', uz: "200 dan ortiq o'ymakor yog'och ustunli namozxona."},
  'Tash-Hauli Palace': {ru: 'Дворец Таш-Хаули', uz: 'Toshhovli saroyi'},
  "The khan's palace and harem, with some of the richest tilework in Khiva.": {ru: 'Дворец и гарем хана с одной из самых богатых изразцовых отделок в Хиве.', uz: "Xonning saroyi va haramxonasi, Xivadagi eng boy koshinlardan biri."},
  'Shivit oshi: green dill noodles, a Khorezm speciality': {ru: 'Шивит оши: зелёная лапша с укропом, блюдо Хорезма', uz: 'Shivit oshi: shivitli yashil ugra, Xorazm taomi'},
  'Tukhum barak, local egg dumplings': {ru: 'Тухум барак, местные пельмени с яйцом', uz: 'Tuxum barak, mahalliy chuchvara'},
  'Tea on a rooftop terrace at sunset': {ru: 'Чай на террасе на крыше на закате', uz: 'Quyosh botishida tom terrasasida choy'},

  // Магазин
  Passports: {ru: 'Паспорта', uz: 'Pasportlar'},
  'The Welcome 2 UZB passport, pair sets and passports with special numbers.': {ru: 'Паспорт Welcome 2 UZB, парные наборы и паспорта с особыми номерами.', uz: "Welcome 2 UZB pasporti, juft to'plamlar va maxsus raqamli pasportlar."},
  Covers: {ru: 'Обложки', uz: 'Muqovalar'},
  'Covers to protect your passport on the road.': {ru: 'Обложки, чтобы паспорт не пострадал в дороге.', uz: "Yo'lda pasportni asrash uchun muqovalar."},
  'Sticker packs': {ru: 'Наборы стикеров', uz: "Stikerlar to'plami"},
  'City and region sticker packs for your passport.': {ru: 'Стикеры городов и регионов для вашего паспорта.', uz: 'Pasportingiz uchun shahar va viloyat stikerlari.'},
  'Gift boxes': {ru: 'Подарочные наборы', uz: "Sovg'a qutilari"},
  'Passport, stickers and a cover in one box.': {ru: 'Паспорт, стикеры и обложка в одной коробке.', uz: 'Pasport, stikerlar va muqova bitta qutida.'},
  'Handmade souvenirs': {ru: 'Сувениры ручной работы', uz: "Qo'lda yasalgan esdaliklar"},
  'Small pieces from local craftspeople.': {ru: 'Небольшие вещи от местных мастеров.', uz: 'Mahalliy hunarmandlarning kichik buyumlari.'},
  'Welcome 2 UZB passport': {ru: 'Паспорт Welcome 2 UZB', uz: 'Welcome 2 UZB pasporti'},
  'Pair set: two passports': {ru: 'Парный набор: два паспорта', uz: "Juft to'plam: ikkita pasport"},
  'Classic passport cover': {ru: 'Классическая обложка для паспорта', uz: 'Klassik pasport muqovasi'},
  'City sticker pack': {ru: 'Набор стикеров городов', uz: "Shahar stikerlari to'plami"},
  'Welcome gift box': {ru: 'Подарочный набор Welcome', uz: "Welcome sovg'a qutisi"},

  // FAQ
  'Is this a real passport?': {ru: 'Это настоящий паспорт?', uz: 'Bu haqiqiy pasportmi?'},
  'No. It is a souvenir travel journal made to look like a passport. It is not an identity document.': {
    ru: 'Нет. Это сувенирный дневник путешествия в виде паспорта. Он не является документом, удостоверяющим личность.',
    uz: "Yo'q. Bu pasport ko'rinishidagi esdalik safar kundaligi. U shaxsni tasdiqlovchi hujjat emas.",
  },
  'Do I have to follow the route in order?': {ru: 'Нужно проходить маршрут по порядку?', uz: "Yo'nalishni tartib bilan o'tish shartmi?"},
  'No. Start wherever your trip starts. The numbers are only the most common direction of travel.': {
    ru: 'Нет. Начинайте там, где начинается ваша поездка. Номера показывают только самое частое направление.',
    uz: "Yo'q. Safaringiz qayerdan boshlansa, o'sha yerdan boshlang. Raqamlar faqat eng ko'p tanlanadigan yo'nalishni ko'rsatadi.",
  },
  'What if a stamp point is closed?': {ru: 'Что делать, если точка штампа закрыта?', uz: "Muhr nuqtasi yopiq bo'lsa-chi?"},
  "Check the hours on the city page. If it is closed during the posted hours, message us and we'll find a solution.": {
    ru: 'Проверьте часы работы на странице города. Если в рабочее время закрыто, напишите нам, и мы найдём решение.',
    uz: "Shahar sahifasida ish vaqtini tekshiring. Ish vaqtida yopiq bo'lsa, bizga yozing, yechim topamiz.",
  },
  'Can I get a stamp without visiting the city?': {ru: 'Можно получить штамп, не побывав в городе?', uz: 'Shaharga bormasdan muhr olsa bo\'ladimi?'},
  'No. Stamps are given only in person at official stamp points.': {ru: 'Нет. Штампы ставят только лично, в официальных точках.', uz: "Yo'q. Muhrlar faqat rasmiy muhr nuqtalarida shaxsan qo'yiladi."},
  'How do I claim the reward?': {ru: 'Как получить подарок?', uz: "Sovg'ani qanday olaman?"},
  'Show your passport with all four main stamps at any stamp point. The partner puts the Route complete stamp on page 17 and gives you a gift. Details: welcome2.uz/reward.': {
    ru: 'Покажите паспорт с четырьмя основными штампами в любой точке штампа. Партнёр поставит штамп Route complete на страницу 17 и вручит подарок. Подробнее: welcome2.uz/ru/reward.',
    uz: "To'rtta asosiy muhrli pasportni istalgan muhr nuqtasida ko'rsating. Hamkor 17-sahifaga Route complete muhrini qo'yadi va sovg'a beradi. Batafsil: welcome2.uz/uz/reward.",
  },
  'Show your passport with all four stamps at the final stamp point in Khiva.': {
    ru: 'Покажите паспорт с четырьмя основными штампами в любой точке штампа. Партнёр поставит штамп Route complete на страницу 17 и вручит подарок. Подробнее: welcome2.uz/ru/reward.',
    uz: "To'rtta asosiy muhrli pasportni istalgan muhr nuqtasida ko'rsating. Hamkor 17-sahifaga Route complete muhrini qo'yadi va sovg'a beradi. Batafsil: welcome2.uz/uz/reward.",
  },
  'Is the site available in other languages?': {ru: 'Сайт есть на других языках?', uz: 'Sayt boshqa tillarda bormi?'},
  'Russian and Uzbek versions are coming soon.': {ru: 'Да: на английском, русском и узбекском. Язык переключается вверху страницы.', uz: "Ha: ingliz, rus va o'zbek tillarida. Tilni sahifa tepasida almashtirish mumkin."},
}

/** Заменяет известные английские строки на перевод во всём объекте (рекурсивно). */
export function translateContent<T>(value: T, lang: 'en' | 'ru' | 'uz'): T {
  if (lang === 'en') return value
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') {
      const tr = CONTENT_TR[v.trim()]
      return tr ? tr[lang] : v
    }
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {}
      for (const [k, val] of Object.entries(v)) {
        // адреса, ссылки и служебные поля не трогаем
        out[k] = k === 'slug' || k === 'citySlug' || k === 'categorySlug' || k === 'url' || k === 'nameUz' || k.endsWith('Url') ? val : walk(val)
      }
      return out
    }
    return v
  }
  return walk(value) as T
}
