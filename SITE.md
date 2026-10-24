# welcome2.uz — шпаргалка по сайту

Кратко: что сделано, как устроено, где что настроено, сроки и нюансы.
Для владельца и для ИИ-помощников, которые будут работать с проектом.

> **Паролей и токенов здесь нет и быть не должно.** Репозиторий на GitHub публичный.
> Пароли храните в менеджере паролей. Ниже указано только, *где* лежит каждый секрет.

Обновлено: 24.10.2026 · версия сайта **1.1.0**

---

## 1. Что это

Сайт серии сувенирных паспортов **Welcome 2 UZ** (бренд SilkPass). Туристы попадают сюда
по QR-кодам из напечатанного паспорта. Три языка: EN (корень), RU (`/ru`), UZ (`/uz`).

**Адреса QR в паспорте зашиты навсегда — не переименовывать и не удалять:**
`/tashkent` `/samarkand` `/bukhara` `/khiva` `/how-it-works` `/reward`

## 2. Как устроено

| Часть | Что | Где |
|---|---|---|
| Код | Next.js 16, статический экспорт (`output: 'export'`) | GitHub `4everlike2day-cloud/silkpass` (публичный), локально `G:\silkpass` |
| Тексты, города, товары, FAQ, настройки | Sanity (headless CMS) | админка https://welcome2.sanity.studio |
| Хостинг | Cloudflare Pages, проект `welcome2` | dash.cloudflare.com → Workers & Pages |
| Выкладка | GitHub Actions (`.github/workflows/deploy.yml`) → wrangler | не через «Git repository» в Cloudflare |
| Формы | Cloudflare Pages Functions → Telegram | `web/functions/api/lead.ts`, `route-complete.ts` |
| Реестр паспортов | Google Sheets + веб-приложение Apps Script | таблица «Welcome 2 UZB: реестр паспортов», скрипт: `tools/registry-apps-script.js` |
| Почта hello@silkpass.uz | Cloudflare Email Routing → Gmail | см. раздел 5 |

### Когда сайт пересобирается (1–2 мин)
- `git push` в `main` с изменениями в `web/`;
- **Publish в Sanity** (вебхук → GitHub `repository_dispatch: sanity-publish`);
- вручную: GitHub → Actions → Deploy site → Run workflow.

### Папки кода (`web/`)
- `app/` — страницы. EN в корне, `app/ru/*`, `app/uz/*` — обёртки тех же страниц.
- `views/` — общие страницы для трёх языков (Home, City, Guide, Reward, Legal…).
- `components/` — Header (меню, языки, тема), Footer, формы, корзина.
- `lib/i18n.ts` — все тексты интерфейса на 3 языках.
- `lib/contentTr.ts` — переводы контента Sanity, если в Sanity нет RU/UZ версии.
- `lib/legal.ts` — юр. страницы: /offer /delivery /returns /promo-terms /privacy /seller (продавец: `SELLER`).
- `lib/localGuides.ts` — подборки в коде (муралы Ташкента: `/tashkent/murals`).
- `lib/seed.json` — демо-данные, если Sanity недоступен.
- `functions/api/` — обработчики форм (работают на Cloudflare).
- `public/` — картинки, логотипы, фото подборок.

## 3. Аккаунты (логины, без паролей)

| Сервис | Аккаунт | Что там |
|---|---|---|
| GitHub | `4everlike2day-cloud` (почта 4everlike2day@gmail.com) | репозиторий, Actions, секреты выкладки |
| Cloudflare | проверить, на какую почту (вероятно 4everlike2day@gmail.com) | Pages, DNS silkpass.uz, Email Routing |
| Sanity | вход через Google | проект, админка, вебхук |
| Google | 4everlike2day@gmail.com | почта hello@ (пересылка), реестр, Apps Script |
| Telegram | бот для заявок | токен бота — у @BotFather |
| Регистратор .uz | проверить | домены welcome2.uz, silkpass.uz |

Git на ПК: автор `Timur Yuldoshev <4everlike2day@gmail.com>`. Раньше по ошибке был сохранён
аккаунт GitHub `flaresto` — если push даёт 403, выйти из него: `git credential-manager github logout flaresto`.

## 4. Где лежат секреты и настройки

**GitHub → Settings → Secrets and variables → Actions**
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Variables: `SANITY_PROJECT_ID`

**Cloudflare → Workers & Pages → welcome2 → Settings → Variables and secrets**
- `TELEGRAM_BOT_TOKEN` (secret), `TELEGRAM_CHAT_ID` — куда приходят заказы, заявки, «Маршрут пройден»
- `REGISTRY_URL` — адрес веб-приложения Apps Script (…/exec)
- `REGISTRY_SECRET` (secret) — тот же пароль, что в строке `SECRET` скрипта реестра
- Новые/изменённые переменные начинают работать со следующей выкладки.

**Sanity → sanity.io/manage → API → Webhooks**
- вебхук на `https://api.github.com/repos/4everlike2day-cloud/silkpass/dispatches`
  с fine-grained токеном GitHub (Contents: Read and write) — **срок 1 год**.

**Локально (не в git):** `web/.env.local`, `studio/.env` — ID проекта Sanity.

## 5. Почта hello@silkpass.uz

- Входящие: Cloudflare Email Routing (домен silkpass.uz), правило `hello@` → 4everlike2day@gmail.com.
  Catch-all: Drop.
- Ответы от имени hello@: Gmail → «Отправлять письма как», SMTP `smtp.gmail.com:587`, TLS,
  логин 4everlike2day@gmail.com, **пароль приложения Google** (не обычный пароль).
- DNS silkpass.uz: MX Cloudflare, SPF `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`
  (одна запись!), DKIM Cloudflare, DMARC `p=none` (если добавлен).
- В Gmail фильтр «Кому: hello@silkpass.uz → не отправлять в спам».

## 6. Сроки (поставить напоминания)

| Что | Срок | Что будет, если пропустить |
|---|---|---|
| Домен **welcome2.uz** | оплачен до **08.10.2027** | перестанут работать QR во всех напечатанных паспортах |
| Домен silkpass.uz | до 08.10.2027 | пропадёт почта hello@ и бренд |
| Токен GitHub в вебхуке Sanity | ~1 год с создания (дату см. github.com/settings/personal-access-tokens) | правки в Sanity молча перестанут попадать на сайт |
| Пароль приложения Google для hello@ | бессрочно, пока не сменён пароль Google | перестанут уходить ответы от hello@ |

## 7. Как вносить изменения

- **Тексты, города, FAQ, товары, контакты, хештег** — в Sanity → Publish. Сайт обновится сам.
  - Порядок FAQ — поле «Порядок» (10, 20, 30…).
  - Если заполнено RU/UZ поле в Sanity, оно важнее таблицы `contentTr.ts`.
  - Пустые Telegram/WhatsApp в настройках = иконка/кнопка на сайте не показывается.
- **Интерфейс, страницы, дизайн** — код в `web/` → `git add` → `git commit` → `git push`.
- **Схемы Sanity** (новые поля/типы) — после изменения в `studio/` нужна выкладка админки:
  `cd studio` → `npm install` → `npx sanity login` → `npm run deploy`.
- **Версия:** номер в `web/package.json`, виден в футере. Список изменений — `CHANGELOG.md`.
  Выпуск: поднять версию, дописать CHANGELOG, `git tag vX.Y.Z`, `git push --tags`.
  Обновления выпускаем пачками, не после каждой мелочи.

## 8. Как работает «Маршрут пройден» (/reward)

1. Турист отправляет форму: номер паспорта, фото стр. 17, контакт, ссылка на пост (по желанию).
2. `functions/api/route-complete.ts` пишет в реестр через Apps Script и шлёт фото в Telegram.
3. Повторный номер с выданным промокодом → турист сразу видит отказ.
4. Промокод (сейчас ROUTE20, 20%, 14 дней) выдаём **вручную** после проверки фото, отмечаем в реестре.

## 9. Нюансы и известные мелочи

- Сайт статический: Sanity читается только при сборке. Без пересборки изменений не будет.
- Тёмная тема: выбор хранится в браузере (`w2uz-theme`), по умолчанию — как на устройстве.
- Фото муралов №6 и №9 из СМИ (gazeta.uz, nuz.uz) — со временем заменить своими.
- В репозитории остались два старых файла: `web/app/cart/CartView.tsx`, `web/app/shop/CategoryNav.tsx`
  → удалить: `git rm …`, commit, push.
- Статистика: включить Cloudflare Web Analytics (Pages → Metrics → Enable). Без cookie, политику менять не нужно.
- Включить двухфакторную защиту в Cloudflare, GitHub, Google, Sanity.
- Юр. тексты — основа, перед продажами показать юристу; продавец сейчас физлицо, после ИП обновить `SELLER` в `lib/legal.ts`.
- Онлайн-оплаты пока нет (оплата при получении / ссылка Click). Payme/Click на сайт — после ИП.

## 10. Что в планах

- Страница метро Ташкента `/tashkent/metro` (фото собираются в `G:\silkpass\media\metro\`).
- Подборки для других городов по образцу муралов.
- Галерея «Маршрут пройден» из фото туристов (с согласия).
