/**
 * Веб-приложение таблицы «Узбекистан: что посмотреть» (места по всем городам).
 * Отдаёт список мест боту @w2uz_bot и сайту, принимает голоса и предложения мест.
 *
 * Как установить (один раз):
 * 1. Откройте таблицу «Узбекистан: что посмотреть» → Расширения → Apps Script.
 * 2. Удалите всё в файле Code.gs и вставьте этот код. Сохраните.
 * 3. Слева «Настройки проекта» (шестерёнка) → «Свойства скрипта» → «Добавить свойство»:
 *    название SECRET, значение — любой длинный пароль. Тот же пароль впишете в Cloudflare как PLACES_SECRET.
 * 4. «Начать развёртывание» → «Новое развёртывание» → тип «Веб-приложение».
 *    Выполнять от имени: «Я». Доступ: «Все». «Развернуть», разрешите доступ к таблице.
 * 5. Скопируйте URL веб-приложения (заканчивается на /exec) → в Cloudflare как PLACES_SCRIPT_URL.
 * После правок кода: «Начать развёртывание» → «Управление развёртываниями» → карандаш → версия «Новая».
 *
 * Запросы:
 *   GET  ?action=places                 опубликованные места (для сайта), без пароля
 *   GET  ?action=places&secret=…&all=1  все, кроме скрытых (для бота, пока места в черновиках)
 *   POST {secret, action:'vote', place, uid, v, toggle}   v = 1 (лайк), -1 (дизлайк), 0 (снять голос);
 *        toggle: true — повторный голос тем же знаком снимает голос
 *   POST {secret, action:'suggest', city, name, description, category, link, location, contact}
 */

const PLACES = 'Места'
const VOTES = 'Голоса'
const SUGGEST = 'Предложения'
const CATS = 'Категории'

const json = (obj) => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
const secret = () => PropertiesService.getScriptProperties().getProperty('SECRET') || ''
const clip = (v, n) => String(v == null ? '' : v).trim().slice(0, n)

// Столбцы ищем по началу заголовка, чтобы таблицу можно было расширять, не трогая код.
function columns(sh) {
  const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String)
  const find = (start) => head.findIndex((h) => h.indexOf(start) === 0) + 1
  return {
    id: find('ID'), city: find('Город'), name: find('Название'), description: find('Описание'), category: find('Категория'),
    link: find('Ссылка'), location: find('Локация'), photo: find('Фото'), likes: find('Лайки'), dislikes: find('Дизлайки'),
    status: find('Статус'),
  }
}

function places(includeDrafts) {
  const ss = SpreadsheetApp.getActive()
  const sh = ss.getSheetByName(PLACES)
  const c = columns(sh)
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues() : []
  const list = []
  rows.forEach((r) => {
    const status = String(r[c.status - 1])
    if (!r[c.id - 1] || !r[c.name - 1]) return
    if (status === 'Скрыто') return
    if (!includeDrafts && status !== 'Опубликовано') return
    list.push({
      id: String(r[c.id - 1]), city: c.city ? String(r[c.city - 1]) || 'Ташкент' : 'Ташкент', name: String(r[c.name - 1]), description: String(r[c.description - 1]),
      category: String(r[c.category - 1]), link: String(r[c.link - 1]), location: String(r[c.location - 1]), photo: c.photo ? String(r[c.photo - 1]) : '',
      likes: Number(r[c.likes - 1]) || 0, dislikes: Number(r[c.dislikes - 1]) || 0, status,
    })
  })
  const cs = ss.getSheetByName(CATS)
  const categories = cs.getRange(2, 1, Math.max(cs.getLastRow() - 1, 1), 1).getValues().map((r) => String(r[0])).filter(Boolean)
  return {categories, places: list}
}

function doGet(e) {
  const p = (e && e.parameter) || {}
  if (p.action !== 'places') return json({error: 'unknown action'})
  const all = p.all === '1' && p.secret && p.secret === secret()
  return json(places(all))
}

function vote(data) {
  const place = clip(data.place, 20)
  const uid = clip(data.uid, 80)
  let v = Number(data.v)
  if (!place || !uid || [1, -1, 0].indexOf(v) < 0) return {error: 'bad vote'}

  const ss = SpreadsheetApp.getActive()
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const sp = ss.getSheetByName(PLACES)
    const c = columns(sp)
    const ids = sp.getRange(2, c.id, Math.max(sp.getLastRow() - 1, 1), 1).getValues().map((r) => String(r[0]))
    const prow = ids.indexOf(place)
    if (prow < 0) return {error: 'no place'}

    const sv = ss.getSheetByName(VOTES)
    const n = Math.max(sv.getLastRow() - 1, 0)
    const all = n ? sv.getRange(2, 1, n, 3).getValues() : []
    let mine = -1
    for (let i = 0; i < all.length; i++) if (String(all[i][0]) === place && String(all[i][1]) === uid) { mine = i; break }

    const before = mine >= 0 ? Number(all[mine][2]) : 0
    if (data.toggle && before === v) v = 0 // повторное нажатие той же кнопки снимает голос
    const now = new Date()
    if (mine >= 0) {
      sv.getRange(mine + 2, 3, 1, 2).setValues([[v, now]])
      all[mine][2] = v
    } else if (v !== 0) {
      sv.appendRow([place, uid, v, now])
      all.push([place, uid, v])
    }

    let likes = 0, dislikes = 0
    all.forEach((r) => {
      if (String(r[0]) !== place) return
      if (Number(r[2]) === 1) likes++
      if (Number(r[2]) === -1) dislikes++
    })
    sp.getRange(prow + 2, c.likes).setValue(likes)
    sp.getRange(prow + 2, c.dislikes).setValue(dislikes)
    return {likes, dislikes, before, v}
  } finally {
    lock.releaseLock()
  }
}

function suggest(data) {
  const name = clip(data.name, 120)
  if (!name) return {error: 'no name'}
  const sh = SpreadsheetApp.getActive().getSheetByName(SUGGEST)
  sh.appendRow([new Date(), clip(data.city, 40), name, clip(data.description, 1000), clip(data.category, 80), clip(data.link, 300),
    clip(data.location, 300), clip(data.contact, 120), 'Новое', clip(data.note, 300)])
  return {ok: true}
}

function doPost(e) {
  let data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return json({error: 'bad json'})
  }
  if (!data.secret || data.secret !== secret()) return json({error: 'forbidden'})
  if (data.action === 'vote') return json(vote(data))
  if (data.action === 'suggest') return json(suggest(data))
  return json({error: 'unknown action'})
}
