# SilkPass · Welcome 2 UZB

Сайт welcome2.uz и его админка.

```
silkpass/
├── web/      сайт на Next.js (то, что видят туристы)
└── studio/   админка Sanity (где вы правите контент)
```

## Как это устроено

1. Вы правите контент в админке Sanity: города, партнёров, скидки, товары.
2. Нажимаете **Publish**.
3. Sanity сообщает Cloudflare, и тот за 1–2 минуты пересобирает сайт.
4. Заказы из корзины и заявки партнёров приходят вам в Telegram.

Пока проект Sanity не подключён, сайт собирается на демо-данных из `web/lib/seed.json`.

---

## Запуск: один раз, по шагам

Нужно: компьютер с [Node.js 22](https://nodejs.org) и аккаунты GitHub, Sanity, Cloudflare (всё бесплатно).

### Шаг 1. Код на GitHub

1. Создайте на github.com приватный репозиторий `silkpass`.
2. Загрузите туда содержимое этой папки (кнопка «uploading an existing file» или через `git push`).

### Шаг 2. Админка Sanity

1. Зайдите на [sanity.io](https://www.sanity.io), войдите через Google и создайте проект **Welcome 2 UZB**. Dataset: `production`.
2. Скопируйте **Project ID** (он виден на sanity.io/manage).
3. В терминале:
   ```bash
   cd studio
   cp .env.example .env          # впишите туда Project ID
   npm install
   npx sanity login
   npm run import-seed           # загрузит города, FAQ, категории и примеры товаров
   npm run deploy                # админка будет доступна по адресу https://welcome2.sanity.studio
   ```
4. На sanity.io/manage → **API → CORS origins** добавьте `https://welcome2.uz`.

Если адрес `welcome2` уже занят, поменяйте `studioHost` в `studio/sanity.cli.ts`.

### Шаг 3. Сайт на Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**, выберите репозиторий.
2. Настройки сборки:
   - Framework preset: **Next.js (Static HTML Export)**
   - Root directory: `web`
   - Build command: `npm run build`
   - Build output directory: `out`
3. **Environment variables** (Settings → Variables and secrets):
   | Переменная | Значение |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | ваш Project ID |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `TELEGRAM_BOT_TOKEN` | токен бота (шаг 5) |
   | `TELEGRAM_CHAT_ID` | ID чата (шаг 5) |
   | `NODE_VERSION` | `22` |
4. Нажмите **Save and Deploy**. Сайт откроется по адресу вида `silkpass.pages.dev`.

### Шаг 4. Домен welcome2.uz

1. В проекте Pages → **Custom domains → Set up a custom domain** → `welcome2.uz`, затем ещё раз для `www.welcome2.uz`.
2. Cloudflare покажет, какие DNS-записи нужны. Самый простой путь: добавить домен в Cloudflare целиком (**Add a site**) и у регистратора .uz сменить NS-серверы на те, что даст Cloudflare.
3. silkpass.uz можно добавить так же и настроить редирект на основной сайт (**Rules → Redirect Rules**).

### Шаг 5. Telegram-бот для заказов

1. В Telegram откройте **@BotFather** → `/newbot` → получите токен.
2. Создайте группу «Заказы Welcome 2 UZB», добавьте туда бота, отправьте любое сообщение.
3. Откройте в браузере `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id":-100…}`. Это и есть `TELEGRAM_CHAT_ID`.
4. Впишите оба значения в Cloudflare (шаг 3) и пересоберите сайт (**Deployments → Retry deployment**).

### Шаг 6. Автопересборка после правок в админке

1. Cloudflare Pages → **Settings → Builds → Deploy hooks** → создайте хук, скопируйте URL.
2. sanity.io/manage → **API → Webhooks → Create webhook**:
   - URL: адрес хука из Cloudflare
   - Dataset: `production`, Trigger on: Create, Update, Delete
   - HTTP method: POST
3. Готово: каждый Publish в админке обновляет сайт примерно за 1–2 минуты.

---

## Правила, которые нельзя нарушать

- **Адреса городов** (`/tashkent`, `/samarkand`, `/bukhara`, `/khiva`) и **`/how-it-works`** зашиты в QR-кодах паспорта. После печати не меняйте поле «Адрес страницы» у городов.
- QR в паспорте печатайте с полным адресом: `https://welcome2.uz/samarkand`.
- Не храните в Sanity личные данные клиентов. Для заметок о партнёрах есть поле «Заметка для себя», оно на сайт не выводится, но доступно всем, у кого есть доступ к админке.

## Что где править

| Хочу изменить | Где |
|---|---|
| Цену паспорта, контакты, текст на главной | Админка → Настройки сайта |
| Точку штампа в городе | Админка → Партнёры, роль «Точка штампа» |
| Где купить | Партнёры, роль «Точка продажи паспортов» |
| Скидки для владельцев | Админка → Скидки |
| Рекламу на странице города | Админка → Реклама |
| Товары и категории | Админка → Шоп |
| Дизайн, новые разделы | Код в папке `web/` |

## Для разработчика

```bash
cd web
cp .env.example .env.local   # можно оставить пустым: будут демо-данные
npm install
npm run dev                  # http://localhost:3000
npm run build                # статическая сборка в web/out
```

- Next.js 16 (App Router), статический экспорт `output: 'export'`.
- Данные: `web/lib/sanity.ts` (GROQ-запросы), `web/lib/data.ts` (загрузка с откатом на `seed.json`).
- Все тексты в Sanity хранятся с переводами `{en, ru, uz}`. Чтобы включить RU/UZ, нужно добавить маршруты `/ru/…`, `/uz/…` и передавать язык в `lib/data.ts`.
- Форма заказа и заявок: `web/functions/api/lead.ts` (Cloudflare Pages Function). Локально через `next dev` она не работает; для проверки используйте `npx wrangler pages dev out` после сборки.
- Схема админки: `studio/schemaTypes/`. Демо-данные для импорта пересобираются командой `node seed/make-seed.mjs`.
