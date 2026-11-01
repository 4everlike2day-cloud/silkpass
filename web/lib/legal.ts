import type {Lang} from './i18n'

// Юридические страницы для покупателей: доставка, возврат, промокоды, персональные данные, оферта, продавец.
// Тексты на трёх языках. {email}, {telegram}, {whatsapp} подставляются из настроек сайта в Sanity.
// Перед публикацией тексты стоит показать юристу. Когда появится ИП, обновите SELLER и раздел «Продавец».

export const LEGAL_UPDATED = '20.10.2026'

export const SELLER = {
  name: {en: 'Timur Yuldoshev', ru: 'Тимур Юлдошев', uz: 'Timur Yuldoshev'},
  status: {en: 'private individual', ru: 'физическое лицо', uz: 'jismoniy shaxs'},
  city: {en: 'Tashkent, Uzbekistan', ru: 'Ташкент, Узбекистан', uz: "Toshkent, O'zbekiston"},
}

export const LEGAL_SLUGS = ['offer', 'delivery', 'returns', 'promo-terms', 'privacy', 'seller'] as const
export type LegalSlug = (typeof LEGAL_SLUGS)[number]

// Абзац, который начинается с «• », показывается как пункт списка.
type Doc = {title: string; lede: string; sections: [string, string[]][]}

export const LEGAL: Record<LegalSlug, Record<Lang, Doc>> = {
  offer: {
    ru: {
      title: 'Публичная оферта',
      lede: 'Условия продажи сувенирной продукции Welcome 2 UZ через сайт welcome2.uz.',
      sections: [
        ['1. Общие положения', [
          'Этот документ является публичной офертой продавца (сведения о нём на странице «Продавец») любому лицу, которое оформляет заказ на сайте welcome2.uz или в мессенджерах проекта.',
          'Оформляя заказ, вы подтверждаете, что прочитали и принимаете условия оферты, а также правила доставки, возврата, выдачи подарков и обработки персональных данных, опубликованные на сайте.',
        ]],
        ['2. Предмет', [
          'Продавец передаёт покупателю сувенирную продукцию (сувенирные паспорта путешественника, наборы, наклейки и другие товары сувенир-шопа), а покупатель оплачивает и принимает её.',
          'Сувенирный паспорт Welcome 2 UZ не является документом, удостоверяющим личность, и не даёт права на пересечение границы.',
        ]],
        ['3. Заказ и цена', [
          'Цены указаны на сайте в узбекских сумах. Цена фиксируется в момент подтверждения заказа.',
          'После оформления заказа мы связываемся с вами в течение дня, чтобы подтвердить наличие, способ получения и оплату. Заказ считается принятым после такого подтверждения.',
        ]],
        ['4. Оплата', [
          '• Наличными или переводом при получении у партнёра или курьера.',
          '• По ссылке на оплату, которую мы присылаем после подтверждения заказа.',
          'Онлайн-оплата картой на сайте появится позже. Мы сообщим об этом на сайте.',
        ]],
        ['5. Получение', [
          'Способы, сроки и стоимость получения описаны на странице «Доставка и получение». Риск случайной порчи переходит к покупателю в момент передачи товара.',
        ]],
        ['6. Возврат и обмен', [
          'Порядок возврата и обмена описан на странице «Возврат и обмен» и не ограничивает права покупателя, предусмотренные законодательством Республики Узбекистан.',
        ]],
        ['7. Прочие условия', [
          'К отношениям сторон применяется законодательство Республики Узбекистан. Споры решаются путём переговоров, а при недостижении согласия в порядке, установленном законодательством.',
          'Продавец может изменять условия оферты. Новая редакция действует с момента публикации на сайте и не распространяется на уже подтверждённые заказы.',
        ]],
      ],
    },
    en: {
      title: 'Public offer',
      lede: 'Terms of sale for Welcome 2 UZ souvenirs sold through welcome2.uz.',
      sections: [
        ['1. General', [
          'This document is a public offer from the seller (see the Seller page) to anyone who places an order on welcome2.uz or through the project messengers.',
          'By placing an order you confirm that you have read and accept this offer and the delivery, returns, gift and privacy rules published on the site.',
        ]],
        ['2. Subject', [
          'The seller provides souvenir products (souvenir travel passports, sets, stickers and other souvenir shop items), and the buyer pays for and accepts them.',
          'The Welcome 2 UZ souvenir passport is not an identity document and does not entitle anyone to cross a border.',
        ]],
        ['3. Orders and prices', [
          'Prices are shown in Uzbek sum. The price is fixed when the order is confirmed.',
          'After you place an order we contact you within a day to confirm availability, pickup or delivery, and payment. The order is accepted once confirmed.',
        ]],
        ['4. Payment', [
          '• Cash or transfer on pickup from a partner or courier.',
          '• A payment link that we send after confirming the order.',
          'Online card payment on the site will be added later. We will announce it on the site.',
        ]],
        ['5. Pickup and delivery', [
          'Options, timing and costs are described on the Delivery and pickup page. The risk of accidental damage passes to the buyer when the goods are handed over.',
        ]],
        ['6. Returns and exchanges', [
          'Returns and exchanges are described on the Returns page and do not limit the buyer\'s rights under the law of the Republic of Uzbekistan.',
        ]],
        ['7. Other terms', [
          'The law of the Republic of Uzbekistan applies. Disputes are settled by negotiation and, failing that, as provided by law.',
          'The seller may change this offer. A new version applies from its publication on the site and does not affect orders already confirmed.',
        ]],
      ],
    },
    uz: {
      title: 'Ommaviy oferta',
      lede: "Welcome 2 UZ esdalik mahsulotlarini welcome2.uz sayti orqali sotish shartlari.",
      sections: [
        ['1. Umumiy qoidalar', [
          "Ushbu hujjat sotuvchining (ma'lumotlar «Sotuvchi» sahifasida) welcome2.uz saytida yoki loyiha messenjerlarida buyurtma beradigan har qanday shaxsga ommaviy ofertasidir.",
          "Buyurtma berish orqali siz oferta shartlarini, shuningdek saytda e'lon qilingan yetkazib berish, qaytarish, sovg'alar va shaxsiy ma'lumotlarni qayta ishlash qoidalarini o'qib chiqqaningiz va qabul qilganingizni tasdiqlaysiz.",
        ]],
        ['2. Predmet', [
          "Sotuvchi xaridorga esdalik mahsulotlarini (esdalik sayohat pasportlari, to'plamlar, stikerlar va suvenir do'konidagi boshqa mahsulotlar) beradi, xaridor esa ularni to'laydi va qabul qiladi.",
          "Welcome 2 UZ esdalik pasporti shaxsni tasdiqlovchi hujjat emas va chegarani kesib o'tish huquqini bermaydi.",
        ]],
        ['3. Buyurtma va narx', [
          "Narxlar saytda o'zbek so'mida ko'rsatilgan. Narx buyurtma tasdiqlangan paytda belgilanadi.",
          "Buyurtmadan so'ng mavjudlik, olish usuli va to'lovni tasdiqlash uchun bir kun ichida siz bilan bog'lanamiz. Buyurtma shu tasdiqdan keyin qabul qilingan hisoblanadi.",
        ]],
        ["4. To'lov", [
          "• Hamkor yoki kuryerdan olishda naqd pul yoki o'tkazma orqali.",
          "• Buyurtma tasdiqlangandan keyin yuboradigan to'lov havolasi orqali.",
          "Saytda karta orqali onlayn to'lov keyinroq qo'shiladi. Bu haqda saytda xabar beramiz.",
        ]],
        ['5. Olish', [
          "Olish usullari, muddatlari va narxi «Yetkazib berish va olish» sahifasida yozilgan. Tasodifiy shikastlanish xavfi tovar topshirilgan paytda xaridorga o'tadi.",
        ]],
        ['6. Qaytarish va almashtirish', [
          "Qaytarish va almashtirish tartibi «Qaytarish va almashtirish» sahifasida yozilgan va xaridorning O'zbekiston Respublikasi qonunchiligida nazarda tutilgan huquqlarini cheklamaydi.",
        ]],
        ['7. Boshqa shartlar', [
          "Tomonlar munosabatlariga O'zbekiston Respublikasi qonunchiligi qo'llaniladi. Nizolar muzokaralar yo'li bilan, kelishuvga erishilmasa, qonunchilikda belgilangan tartibda hal qilinadi.",
          "Sotuvchi oferta shartlarini o'zgartirishi mumkin. Yangi tahrir saytda e'lon qilingan paytdan kuchga kiradi va allaqachon tasdiqlangan buyurtmalarga tatbiq etilmaydi.",
        ]],
      ],
    },
  },

  delivery: {
    ru: {
      title: 'Доставка и получение',
      lede: 'Удобнее всего забрать паспорт у наших партнёров на маршруте. Почтой отправляем, если забрать лично не получается.',
      sections: [
        ['Самовывоз у партнёров', [
          'Основной способ. Адреса партнёров и часы работы есть на странице «Купить паспорт» и на страницах городов. Большинство точек находится в Ташкенте.',
          'После подтверждения заказа партнёр держит его для вас 3 дня. Оплата наличными или переводом при получении.',
        ]],
        ['Почта по Узбекистану', [
          'Отправляем почтой Узбекистана (Uzpost или EMS) в любой город страны.',
          '• Стоимость пересылки оплачивает покупатель по тарифу почты. Сумму называем при подтверждении заказа.',
          '• Отправляем в течение 2 рабочих дней после оплаты. Срок в пути зависит от почты, обычно от 3 до 7 дней.',
          '• Присылаем трек-номер для отслеживания.',
        ]],
        ['Доставка в отель', [
          'В Ташкенте можем привезти заказ в отель по договорённости. Стоимость и время согласуем при подтверждении заказа.',
        ]],
        ['Другие страны', [
          'Международную доставку пока не делаем. Если вы уже уехали, напишите нам, и мы подумаем, как помочь.',
        ]],
        ['Проверка при получении', [
          'Проверьте товар и целостность пломбы-наклейки на упаковке при получении. Если что-то не так, сообщите партнёру или нам сразу.',
        ]],
      ],
    },
    en: {
      title: 'Delivery and pickup',
      lede: 'The easiest way is to pick up your passport from one of our partners on the route. We post it only when pickup is not possible.',
      sections: [
        ['Pickup from partners', [
          'The main option. Partner addresses and opening hours are on the Get a passport page and the city pages. Most points are in Tashkent.',
          'Once your order is confirmed, the partner keeps it for you for 3 days. Pay in cash or by transfer on pickup.',
        ]],
        ['Post within Uzbekistan', [
          'We send orders by Uzbek post (Uzpost or EMS) to any city in the country.',
          '• The buyer pays postage at the postal rate. We tell you the amount when confirming the order.',
          '• We ship within 2 working days after payment. Transit time depends on the post, usually 3 to 7 days.',
          '• We send you a tracking number.',
        ]],
        ['Delivery to your hotel', [
          'In Tashkent we can bring the order to your hotel by arrangement. Cost and time are agreed when the order is confirmed.',
        ]],
        ['Other countries', [
          'We do not ship abroad yet. If you have already left Uzbekistan, message us and we will see how we can help.',
        ]],
        ['Check on receipt', [
          'Check the item and the seal sticker on the packaging when you receive it. If something is wrong, tell the partner or us right away.',
        ]],
      ],
    },
    uz: {
      title: 'Yetkazib berish va olish',
      lede: "Pasportni yo'nalishdagi hamkorlarimizdan olish eng qulay. Shaxsan olishning iloji bo'lmasa, pochta orqali yuboramiz.",
      sections: [
        ['Hamkordan olib ketish', [
          "Asosiy usul. Hamkorlar manzillari va ish vaqti «Pasport olish» sahifasida va shahar sahifalarida. Ko'pchilik nuqtalar Toshkentda.",
          "Buyurtma tasdiqlangach, hamkor uni siz uchun 3 kun saqlaydi. To'lov olishda naqd pul yoki o'tkazma orqali.",
        ]],
        ["O'zbekiston bo'ylab pochta", [
          "O'zbekiston pochtasi (Uzpost yoki EMS) orqali mamlakatning istalgan shahriga yuboramiz.",
          "• Pochta xarajatini xaridor pochta tarifi bo'yicha to'laydi. Summani buyurtmani tasdiqlashda aytamiz.",
          "• To'lovdan keyin 2 ish kuni ichida jo'natamiz. Yo'ldagi muddat pochtaga bog'liq, odatda 3 kundan 7 kungacha.",
          '• Kuzatish uchun trek-raqam yuboramiz.',
        ]],
        ['Mehmonxonaga yetkazish', [
          "Toshkentda kelishuv bo'yicha buyurtmani mehmonxonangizga olib borishimiz mumkin. Narx va vaqt buyurtmani tasdiqlashda kelishiladi.",
        ]],
        ['Boshqa mamlakatlar', [
          "Hozircha xalqaro yetkazib berish yo'q. Agar allaqachon jo'nab ketgan bo'lsangiz, bizga yozing, qanday yordam berishni o'ylab ko'ramiz.",
        ]],
        ['Olishda tekshirish', [
          "Olishda tovarni va qadoqdagi plomba-stikerning butunligini tekshiring. Biror narsa noto'g'ri bo'lsa, darhol hamkorga yoki bizga xabar bering.",
        ]],
      ],
    },
  },

  returns: {
    ru: {
      title: 'Возврат и обмен',
      lede: 'Чистый паспорт в нетронутой упаковке можно вернуть. Если упаковку открыли, вернуть товар нельзя, но брак мы заменим всегда.',
      sections: [
        ['Когда можно вернуть', [
          '• В течение 10 дней со дня получения.',
          '• Упаковка не вскрыта, пломба-наклейка цела.',
          '• Нет следов использования: записей, печатей, загибов, пятен.',
        ]],
        ['Когда вернуть нельзя', [
          '• Упаковка вскрыта или пломба повреждена.',
          '• В паспорте есть записи, печати, наклейки или он помят, испачкан, повреждён по вине покупателя.',
          'Сувенирная продукция с поставленными печатями и записями становится персональной, поэтому возврату не подлежит.',
        ]],
        ['Брак', [
          'Если вы нашли производственный брак (ошибка печати, дефект переплёта, недостающие страницы), сообщите нам в течение 14 дней со дня получения и пришлите фото. Мы заменим товар или вернём деньги, даже если упаковка вскрыта.',
        ]],
        ['Как оформить', [
          'Напишите нам ({email}, Telegram или WhatsApp): номер заказа или дату покупки, причину и фото товара. Мы подскажем, куда передать товар.',
          'Деньги возвращаем тем же способом, которым вы платили, в течение 10 дней после получения товара. Расходы на пересылку при возврате несёт покупатель, кроме случаев брака.',
        ]],
      ],
    },
    en: {
      title: 'Returns and exchanges',
      lede: 'A clean passport in its sealed packaging can be returned. Once the packaging is opened it cannot, but we always replace defective items.',
      sections: [
        ['You can return an item if', [
          '• it is within 10 days of receipt;',
          '• the packaging is unopened and the seal sticker is intact;',
          '• there are no signs of use: no writing, stamps, folds or stains.',
        ]],
        ['You cannot return an item if', [
          '• the packaging has been opened or the seal is damaged;',
          '• the passport has writing, stamps or stickers in it, or is creased, stained or damaged by the buyer.',
          'Souvenirs with stamps and notes become personal items and cannot be returned.',
        ]],
        ['Defects', [
          'If you find a manufacturing defect (printing error, binding defect, missing pages), tell us within 14 days of receipt and send a photo. We will replace the item or refund you, even if the packaging has been opened.',
        ]],
        ['How to return', [
          'Message us ({email}, Telegram or WhatsApp) with the order number or date of purchase, the reason and a photo of the item. We will tell you where to hand it over.',
          'We refund by the same method you paid within 10 days of receiving the item. Return shipping is paid by the buyer, except for defects.',
        ]],
      ],
    },
    uz: {
      title: 'Qaytarish va almashtirish',
      lede: "Ochilmagan qadoqdagi toza pasportni qaytarish mumkin. Qadoq ochilgan bo'lsa, qaytarib bo'lmaydi, ammo nuqsonli mahsulotni har doim almashtiramiz.",
      sections: [
        ["Qachon qaytarish mumkin", [
          '• Olingan kundan boshlab 10 kun ichida.',
          '• Qadoq ochilmagan, plomba-stiker butun.',
          "• Foydalanish izlari yo'q: yozuvlar, muhrlar, bukilishlar, dog'lar.",
        ]],
        ["Qachon qaytarib bo'lmaydi", [
          "• Qadoq ochilgan yoki plomba shikastlangan.",
          "• Pasportda yozuvlar, muhrlar, stikerlar bor yoki u xaridor aybi bilan g'ijimlangan, ifloslangan, shikastlangan.",
          "Muhr va yozuvlar qo'yilgan esdalik mahsuloti shaxsiy buyumga aylanadi, shuning uchun qaytarilmaydi.",
        ]],
        ['Nuqson', [
          "Ishlab chiqarish nuqsonini (bosma xatosi, muqova nuqsoni, yetishmayotgan sahifalar) topsangiz, olingan kundan boshlab 14 kun ichida bizga xabar bering va surat yuboring. Qadoq ochilgan bo'lsa ham, mahsulotni almashtiramiz yoki pulni qaytaramiz.",
        ]],
        ['Qanday rasmiylashtirish', [
          "Bizga yozing ({email}, Telegram yoki WhatsApp): buyurtma raqami yoki xarid sanasi, sababi va mahsulot surati. Mahsulotni qayerga topshirishni aytamiz.",
          "Pulni mahsulotni olganimizdan keyin 10 kun ichida siz to'lagan usulda qaytaramiz. Qaytarishda jo'natish xarajatini xaridor to'laydi, nuqson holatlari bundan mustasno.",
        ]],
      ],
    },
  },

  'promo-terms': {
    ru: {
      title: 'Условия подарков',
      lede: 'За пройденный маршрут владелец паспорта выбирает один подарок из списка, доступного на странице «Подарок» в момент отправки заявки.',
      sections: [
        ['Как получить', [
          'Подарок выдаётся после печати Route complete и проверки номера паспорта по нашему реестру. Подробности на странице «Подарок».',
          '• Один подарок на один номер паспорта.',
          '• Печати, поставленные по почте, для подарка не засчитываются.',
          '• Список подарков может меняться. Если выбранного подарка не окажется в наличии, мы предложим равноценную замену.',
          '• Где и как забрать подарок, мы сообщим в ответ на заявку: часть подарков выдают наши партнёры на месте.',
          '• Подарки не обмениваются на деньги.',
        ]],
        ['Промокод на паспорт', [
          '• Скидка 20% на паспорт в нашем шопе — себе или в подарок другу.',
          '• Срок действия 14 дней со дня выдачи.',
          '• Один промокод действует на один заказ.',
          '• Не суммируется с другими скидками и акциями.',
          '• Не распространяется на стоимость доставки.',
        ]],
        ['Отказ и отмена', [
          'Мы можем отказать в выдаче подарка или отменить промокод, если номер паспорта не найден в реестре, фото не подтверждает пройденный маршрут или есть признаки злоупотребления.',
        ]],
      ],
    },
    en: {
      title: 'Gift terms',
      lede: 'For a completed route the passport holder chooses one gift from the list shown on the Reward page at the time of the application.',
      sections: [
        ['How to get it', [
          'The gift is issued after the Route complete stamp and a check of the passport number against our register. Details are on the Reward page.',
          '• One gift per passport number.',
          '• Stamps added by post do not count towards the gift.',
          '• The list of gifts may change. If the chosen gift is out of stock, we will offer an equivalent replacement.',
          '• We tell you where and how to collect the gift in our reply: some gifts are handed out by our partners on the spot.',
          '• Gifts cannot be exchanged for cash.',
        ]],
        ['Passport promo code', [
          '• 20% off a passport in our shop, for yourself or as a gift for a friend.',
          '• Valid for 14 days from the date of issue.',
          '• One code applies to one order.',
          '• Cannot be combined with other discounts or offers.',
          '• Does not apply to delivery costs.',
        ]],
        ['Refusal and cancellation', [
          'We may refuse a gift or cancel a code if the passport number is not in the register, the photo does not confirm the completed route, or there are signs of abuse.',
        ]],
      ],
    },
    uz: {
      title: "Sovg'a shartlari",
      lede: "Yakunlangan yo'nalish uchun pasport egasi ariza yuborilgan paytda «Sovg'a» sahifasida ko'rsatilgan ro'yxatdan bitta sovg'ani tanlaydi.",
      sections: [
        ['Qanday olish mumkin', [
          "Sovg'a Route complete muhri va pasport raqami reestrimiz bo'yicha tekshirilgandan keyin beriladi. Batafsil «Sovg'a» sahifasida.",
          "• Bitta pasport raqamiga bitta sovg'a.",
          "• Pochta orqali bosilgan muhrlar sovg'a uchun hisobga olinmaydi.",
          "• Sovg'alar ro'yxati o'zgarishi mumkin. Tanlangan sovg'a qolmagan bo'lsa, teng qiymatli almashtirish taklif qilamiz.",
          "• Sovg'ani qayerda va qanday olishni javobimizda yozamiz: ba'zi sovg'alarni hamkorlarimiz joyida beradi.",
          "• Sovg'alar pulga almashtirilmaydi.",
        ]],
        ['Pasport uchun promokod', [
          "• Do'konimizda pasportga 20% chegirma — o'zingizga yoki do'stingizga sovg'a sifatida.",
          '• Amal qilish muddati berilgan kundan boshlab 14 kun.',
          '• Bitta promokod bitta buyurtmaga amal qiladi.',
          "• Boshqa chegirma va aksiyalar bilan qo'shilmaydi.",
          '• Yetkazib berish narxiga tatbiq etilmaydi.',
        ]],
        ['Rad etish va bekor qilish', [
          "Agar pasport raqami reestrda topilmasa, surat yo'nalish yakunlanganini tasdiqlamasa yoki suiiste'mol belgilari bo'lsa, sovg'a berishni rad etishimiz yoki promokodni bekor qilishimiz mumkin.",
        ]],
      ],
    },
  },

  privacy: {
    ru: {
      title: 'Конфиденциальность и персональные данные',
      lede: 'Мы собираем только то, что нужно для заказа, подарка за маршрут и связи с вами, и не продаём ваши данные.',
      sections: [
        ['Кто обрабатывает данные', [
          'Продавец, сведения о котором указаны на странице «Продавец». Связаться по вопросам данных: {email}.',
        ]],
        ['Какие данные мы получаем', [
          '• Заказ: имя, контакт (телефон, Telegram или WhatsApp), город, отель или адрес, комментарий.',
          '• Форма «Маршрут пройден»: номер сувенирного паспорта, выбранный подарок, фото страницы Route complete, контакт, ссылка на пост.',
          '• Заявка партнёра: название заведения, город, контакт, комментарий.',
          'Пожалуйста, не присылайте фото настоящего паспорта или других документов: нам нужен только сувенирный паспорт.',
        ]],
        ['Зачем', [
          'Чтобы подтвердить и выполнить заказ, проверить пройденный маршрут, выдать подарок, ответить на заявку и вести реестр номеров сувенирных паспортов. Ссылку на пост и фото мы можем показать в наших соцсетях или на сайте только с вашего согласия.',
        ]],
        ['Где хранятся данные', [
          '• Сообщения о заказах и заявках приходят в наш рабочий чат Telegram.',
          '• Реестр номеров паспортов ведётся в Google Таблицах.',
          '• Сайт размещён на Cloudflare. Сервис хостинга может хранить технические журналы (например, IP-адрес) для защиты от атак.',
          'Эти сервисы могут хранить данные на серверах за пределами Узбекистана. Отправляя форму, вы соглашаетесь на такую передачу.',
        ]],
        ['Сколько храним', [
          'Данные заказов и заявок храним не дольше 1 года, записи реестра хранятся, пока действует серия паспортов. Удалить данные раньше можно по запросу.',
        ]],
        ['Данные в браузере', [
          'Сайт сохраняет в вашем браузере выбранный язык, тему оформления и содержимое корзины. Рекламных и аналитических cookie мы не используем.',
        ]],
        ['Ваши права', [
          'Вы можете узнать, какие ваши данные у нас есть, исправить их или попросить удалить. Напишите на {email}, ответим в течение 10 дней.',
          'Обработка ведётся с учётом Закона Республики Узбекистан «О персональных данных».',
        ]],
      ],
    },
    en: {
      title: 'Privacy and personal data',
      lede: 'We collect only what we need for orders, the route reward and contacting you, and we never sell your data.',
      sections: [
        ['Who processes the data', [
          'The seller listed on the Seller page. For data questions write to {email}.',
        ]],
        ['What we collect', [
          '• Orders: name, contact (phone, Telegram or WhatsApp), city, hotel or address, comment.',
          '• Route complete form: souvenir passport number, chosen gift, photo of the Route complete page, contact, link to your post.',
          '• Partner applications: business name, city, contact, comment.',
          'Please do not send photos of your real passport or other ID: we only need the souvenir passport.',
        ]],
        ['Why', [
          'To confirm and fulfil orders, check the completed route, issue gifts, reply to applications and keep the register of souvenir passport numbers. We show your post or photo on our social media or site only with your consent.',
        ]],
        ['Where the data is stored', [
          '• Order and application messages arrive in our work chat in Telegram.',
          '• The passport register is kept in Google Sheets.',
          '• The site is hosted on Cloudflare, which may keep technical logs (such as IP addresses) to protect against attacks.',
          'These services may store data on servers outside Uzbekistan. By sending a form you agree to this transfer.',
        ]],
        ['How long we keep it', [
          'Order and application data are kept for up to 1 year; register entries are kept while the passport series is active. You can ask us to delete your data earlier.',
        ]],
        ['Data in your browser', [
          'The site stores your language, theme and cart in your browser. We do not use advertising or analytics cookies.',
        ]],
        ['Your rights', [
          'You can ask what data we hold about you, correct it or ask us to delete it. Write to {email}; we reply within 10 days.',
          'Data is processed in line with the Law of the Republic of Uzbekistan "On Personal Data".',
        ]],
      ],
    },
    uz: {
      title: "Maxfiylik va shaxsiy ma'lumotlar",
      lede: "Biz faqat buyurtma, yo'nalish sovg'asi va siz bilan bog'lanish uchun kerakli ma'lumotlarni yig'amiz va ularni sotmaymiz.",
      sections: [
        ["Ma'lumotlarni kim qayta ishlaydi", [
          "«Sotuvchi» sahifasida ko'rsatilgan sotuvchi. Ma'lumotlar bo'yicha savollar uchun: {email}.",
        ]],
        ["Qanday ma'lumotlarni olamiz", [
          "• Buyurtma: ism, kontakt (telefon, Telegram yoki WhatsApp), shahar, mehmonxona yoki manzil, izoh.",
          "• «Yo'nalish yakunlandi» formasi: esdalik pasport raqami, tanlangan sovg'a, Route complete sahifasi surati, kontakt, postga havola.",
          "• Hamkor arizasi: muassasa nomi, shahar, kontakt, izoh.",
          "Iltimos, haqiqiy pasport yoki boshqa hujjatlar suratini yubormang: bizga faqat esdalik pasporti kerak.",
        ]],
        ['Nima uchun', [
          "Buyurtmani tasdiqlash va bajarish, yakunlangan yo'nalishni tekshirish, sovg'a berish, arizaga javob berish va esdalik pasport raqamlari reestrini yuritish uchun. Postingiz yoki suratingizni ijtimoiy tarmoqlarimizda yoki saytda faqat roziligingiz bilan ko'rsatamiz.",
        ]],
        ["Ma'lumotlar qayerda saqlanadi", [
          "• Buyurtma va ariza xabarlari Telegramdagi ishchi chatimizga keladi.",
          "• Pasport raqamlari reestri Google Sheets'da yuritiladi.",
          "• Sayt Cloudflare'da joylashgan, u hujumlardan himoya uchun texnik jurnallarni (masalan, IP-manzil) saqlashi mumkin.",
          "Bu xizmatlar ma'lumotlarni O'zbekistondan tashqaridagi serverlarda saqlashi mumkin. Formani yuborish orqali siz bunday uzatishga rozilik bildirasiz.",
        ]],
        ['Qancha saqlaymiz', [
          "Buyurtma va ariza ma'lumotlarini 1 yildan ko'p saqlamaymiz, reestr yozuvlari pasport seriyasi amal qilguncha saqlanadi. So'rov bo'yicha ma'lumotlarni oldinroq o'chirish mumkin.",
        ]],
        ["Brauzerdagi ma'lumotlar", [
          "Sayt brauzeringizda tanlangan til, mavzu va savat tarkibini saqlaydi. Reklama va analitika cookie fayllaridan foydalanmaymiz.",
        ]],
        ['Huquqlaringiz', [
          "Siz haqingizda qanday ma'lumotlar borligini bilishingiz, ularni tuzatishingiz yoki o'chirishni so'rashingiz mumkin. {email} manziliga yozing, 10 kun ichida javob beramiz.",
          "Qayta ishlash O'zbekiston Respublikasining «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuni hisobga olingan holda amalga oshiriladi.",
        ]],
      ],
    },
  },

  seller: {
    ru: {
      title: 'Продавец',
      lede: 'Кто продаёт паспорта Welcome 2 UZ и как с нами связаться по заказам.',
      sections: [
        ['Сведения о продавце', [
          '• Продавец: {sellerName}, {sellerStatus}.',
          '• Город: {sellerCity}.',
          '• Бренд: SilkPass, серия сувенирных паспортов Welcome 2 UZ.',
          '• Сайт: welcome2.uz.',
        ]],
        ['Связь по заказам', [
          '• Email: {email}',
          '• Telegram: {telegram}',
          '• WhatsApp: {whatsapp}',
          'Отвечаем каждый день, обычно в течение нескольких часов, не позже чем через сутки.',
        ]],
      ],
    },
    en: {
      title: 'Seller',
      lede: 'Who sells Welcome 2 UZ passports and how to contact us about orders.',
      sections: [
        ['Seller details', [
          '• Seller: {sellerName}, {sellerStatus}.',
          '• City: {sellerCity}.',
          '• Brand: SilkPass, Welcome 2 UZ souvenir passport series.',
          '• Website: welcome2.uz.',
        ]],
        ['Order enquiries', [
          '• Email: {email}',
          '• Telegram: {telegram}',
          '• WhatsApp: {whatsapp}',
          'We reply every day, usually within a few hours and always within 24 hours.',
        ]],
      ],
    },
    uz: {
      title: 'Sotuvchi',
      lede: "Welcome 2 UZ pasportlarini kim sotadi va buyurtmalar bo'yicha biz bilan qanday bog'lanish mumkin.",
      sections: [
        ["Sotuvchi haqida ma'lumot", [
          '• Sotuvchi: {sellerName}, {sellerStatus}.',
          '• Shahar: {sellerCity}.',
          '• Brend: SilkPass, Welcome 2 UZ esdalik pasportlari seriyasi.',
          '• Sayt: welcome2.uz.',
        ]],
        ["Buyurtmalar bo'yicha aloqa", [
          '• Email: {email}',
          '• Telegram: {telegram}',
          '• WhatsApp: {whatsapp}',
          "Har kuni javob beramiz, odatda bir necha soat ichida, kechi bilan bir kun ichida.",
        ]],
      ],
    },
  },
}
