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
 *   POST {secret, action:'seen', uid, lang, source}   учёт пользователей бота (лист «Пользователи», создаётся сам)
 *   GET  ?action=quiz&secret=…          вопросы викторины со статусом «Опубликовано» (лист «Викторина»), с ответами — только с паролем
 *   GET  ?action=quiztop                топ-10 рейтинга викторины по режимам (ники только тех, кто сам поставил галочку)
 *   POST {secret, action:'quizscore', uid, nick, mode, score, ms, show}   лучший результат игрока в рейтинг
 *        (лист «Викторина: рейтинг», создаётся сам); show:false — убрать игрока из рейтинга режима
 *   POST {secret, action:'quizstat', event, mode, lang, score, src}   событие викторины без личных данных
 *        (лист «Викторина: статистика», создаётся сам)
 *
 * Бот берёт ?action=places — только «Опубликовано» (с 26.11.2026); &all=1 больше никто не использует.
 *
 * Автодата: когда в листе «Места» у строки появляются ID и Название, а «Добавлено» пустое,
 * onEdit сам ставит сегодняшнюю дату. Работает сразу после сохранения скрипта — развёртывание не нужно.
 */

const PLACES = 'Места'
const VOTES = 'Голоса'
const SUGGEST = 'Предложения'
const CATS = 'Категории'
const USERS = 'Пользователи'
const QUIZ = 'Викторина'
const QUIZ_STATS = 'Викторина: статистика'
const QUIZ_TOP = 'Викторина: рейтинг'

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
    status: find('Статус'), added: find('Добавлено'),
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

// Автодата «Добавлено»: срабатывает при ручной правке или вставке строк в листе «Места».
function onEdit(e) {
  const range = e && e.range
  if (!range) return
  const sh = range.getSheet()
  if (sh.getName() !== PLACES) return
  const c = columns(sh)
  if (!c.added || !c.id || !c.name) return
  const top = Math.max(range.getRow(), 2)
  const bottom = range.getLastRow()
  if (bottom < top) return
  // Правка должна задеть столбец ID или Название
  const left = range.getColumn(), right = range.getLastColumn()
  const hits = (col) => col >= left && col <= right
  if (!hits(c.id) && !hits(c.name)) return
  const n = bottom - top + 1
  const ids = sh.getRange(top, c.id, n, 1).getValues()
  const names = sh.getRange(top, c.name, n, 1).getValues()
  const dates = sh.getRange(top, c.added, n, 1)
  const cur = dates.getValues()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let changed = false
  for (let i = 0; i < n; i++) {
    if (String(ids[i][0]).trim() && String(names[i][0]).trim() && cur[i][0] === '') { cur[i][0] = today; changed = true }
  }
  if (!changed) return
  dates.setValues(cur)
  dates.setNumberFormat('dd.mm.yyyy')
}

// Викторина «Насколько ты знаешь Узбекистан»: только строки со статусом «Опубликовано».
// Варианты ответа в ячейке разделены « | », «Правильный» — номер варианта (1–4).
// Строку с ошибкой (не тот номер, разное число вариантов на языках) пропускаем, чтобы сломанный вопрос не попал в игру.
function quiz() {
  const sh = SpreadsheetApp.getActive().getSheetByName(QUIZ)
  if (!sh || sh.getLastRow() < 2) return {questions: []}
  const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map((h) => String(h).trim())
  const col = (name) => head.indexOf(name)
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues()
  const cell = (r, name) => (col(name) < 0 ? '' : String(r[col(name)]).trim())
  const opts = (r, l) => cell(r, 'Варианты ' + l).split('|').map((x) => x.trim()).filter(Boolean)
  const MODES = {'Турист': 'tourist', 'Местный': 'local'}
  const out = []
  rows.forEach((r) => {
    if (cell(r, 'Статус') !== 'Опубликовано') return
    const mode = MODES[cell(r, 'Режим')]
    const ru = opts(r, 'RU')
    const correct = Number(cell(r, 'Правильный')) - 1
    if (!cell(r, 'ID') || !mode || !cell(r, 'Вопрос RU') || ru.length < 2 || !(correct >= 0 && correct < ru.length)) return
    const lang = (l) => {
      const o = opts(r, l)
      return o.length === ru.length && cell(r, 'Вопрос ' + l) ? {q: cell(r, 'Вопрос ' + l), options: o, explain: cell(r, 'Пояснение ' + l)} : null
    }
    const tr = {}
    ;['RU', 'EN', 'UZ'].forEach((l) => { const x = lang(l); if (x) tr[l.toLowerCase()] = x })
    out.push({id: cell(r, 'ID'), mode, topic: cell(r, 'Тема'), correct, place: cell(r, 'ID места'), tr})
  })
  return {questions: out}
}

// Статистика викторины: одна строка на событие, без данных о человеке.
const QUIZ_EVENTS = ['open', 'start', 'finish', 'story', 'challenge', 'download', 'place']
function quizStat(data) {
  const event = clip(data.event, 20)
  if (QUIZ_EVENTS.indexOf(event) < 0) return {error: 'bad event'}
  const ss = SpreadsheetApp.getActive()
  let sh = ss.getSheetByName(QUIZ_STATS)
  if (!sh) {
    sh = ss.insertSheet(QUIZ_STATS)
    sh.getRange(1, 1, 1, 6).setValues([['Дата', 'Событие', 'Режим', 'Язык', 'Счёт', 'Откуда']]).setFontWeight('bold')
    sh.setFrozenRows(1)
    sh.getRange('A:A').setNumberFormat('dd.mm.yyyy hh:mm')
  }
  const score = data.score === '' || data.score == null ? '' : Math.max(0, Math.min(10, Number(data.score) || 0))
  sh.appendRow([new Date(), event, clip(data.mode, 10), clip(data.lang, 5), score, clip(data.src, 30)])
  return {ok: true}
}

// Рейтинг викторины: одна строка на игрока и режим, хранится лучший результат.
// Лучше — больше баллов, при равных баллах — меньше времени. Игрок — под шифром, ник — как в Telegram.
function topSheet(ss) {
  let sh = ss.getSheetByName(QUIZ_TOP)
  if (sh) return sh
  sh = ss.insertSheet(QUIZ_TOP)
  sh.getRange(1, 1, 1, 6).setValues([['Игрок (шифр)', 'Ник', 'Режим', 'Счёт', 'Время, сек', 'Дата']]).setFontWeight('bold')
  sh.setFrozenRows(1)
  sh.getRange('F:F').setNumberFormat('dd.mm.yyyy hh:mm')
  return sh
}
function topRows(sh) {
  const n = Math.max(sh.getLastRow() - 1, 0)
  return n ? sh.getRange(2, 1, n, 6).getValues() : []
}
const better = (a, b) => Number(b[3]) - Number(a[3]) || Number(a[4]) - Number(b[4]) || new Date(a[5]) - new Date(b[5])
function quizTop() {
  const ss = SpreadsheetApp.getActive()
  const sh = ss.getSheetByName(QUIZ_TOP)
  const rows = sh ? topRows(sh) : []
  const out = {}
  ;['tourist', 'local'].forEach((m) => {
    out[m] = rows.filter((r) => r[2] === m && r[1]).sort(better).slice(0, 10).map((r) => ({nick: String(r[1]), score: Number(r[3]), sec: Number(r[4])}))
  })
  return out
}
function quizScore(data) {
  const uid = clip(data.uid, 80)
  const mode = data.mode === 'local' ? 'local' : data.mode === 'tourist' ? 'tourist' : ''
  if (!uid || !mode) return {error: 'bad score'}
  const ss = SpreadsheetApp.getActive()
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const sh = topSheet(ss)
    const rows = topRows(sh)
    const at = rows.findIndex((r) => String(r[0]) === uid && r[2] === mode)
    if (!data.show) {
      if (at >= 0) sh.deleteRow(at + 2)
      return {ok: true, removed: at >= 0}
    }
    const row = [uid, clip(data.nick, 40), mode, Math.max(0, Math.min(10, Number(data.score) || 0)), Math.round((Number(data.ms) || 0) / 100) / 10, new Date()]
    if (at < 0) {
      sh.appendRow(row)
      rows.push(row)
    } else {
      // ник обновляем всегда, результат — только если новый лучше
      const old = rows[at]
      const next = better(row, old) < 0 ? row : [old[0], row[1], old[2], old[3], old[4], old[5]]
      sh.getRange(at + 2, 1, 1, 6).setValues([next])
      rows[at] = next
    }
    const mine = rows.filter((r) => r[2] === mode).sort(better)
    const me = rows.find((r) => String(r[0]) === uid && r[2] === mode)
    return {ok: true, rank: mine.indexOf(me) + 1, best: {score: Number(me[3]), sec: Number(me[4])}}
  } finally {
    lock.releaseLock()
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {}
  if (p.action === 'quiz') return json(p.secret && p.secret === secret() ? quiz() : {error: 'forbidden'})
  if (p.action === 'quiztop') return json(quizTop())
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

// Пользователи бота: одна строка на человека (под шифром, без имени и номера), справа — сводка.
function usersSheet(ss) {
  let sh = ss.getSheetByName(USERS)
  if (sh) return sh
  sh = ss.insertSheet(USERS)
  sh.getRange(1, 1, 1, 6).setValues([['Пользователь (шифр)', 'Язык', 'Первый визит', 'Последний визит', 'Действий', 'Пришёл']]).setFontWeight('bold')
  sh.setFrozenRows(1)
  sh.getRange('C:D').setNumberFormat('dd.mm.yyyy hh:mm')
  const sum = [
    ['Всего пользователей', '=COUNTA(A2:A)'],
    ['Активны за 7 дней', '=COUNTIF(D2:D,">="&(TODAY()-7))'],
    ['Новых за 7 дней', '=COUNTIF(C2:C,">="&(TODAY()-7))'],
    ['Новых сегодня', '=COUNTIF(C2:C,">="&TODAY())'],
    ['Вернулись в другой день', '=SUMPRODUCT((A2:A<>"")*(INT(D2:D)>INT(C2:C)))'],
    ['Пришли с сайта', '=COUNTIF(F2:F,"сайт")'],
  ]
  sh.getRange(1, 8, 1, 2).setValues([['Сводка', '']]).setFontWeight('bold')
  sum.forEach((r, i) => { sh.getRange(i + 2, 8).setValue(r[0]); sh.getRange(i + 2, 9).setFormula(r[1]) })
  sh.setColumnWidth(1, 260); sh.setColumnWidth(8, 190)
  return sh
}

function seen(data) {
  const uid = clip(data.uid, 80)
  if (!uid) return {error: 'no uid'}
  const ss = SpreadsheetApp.getActive()
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const sh = usersSheet(ss)
    const n = Math.max(sh.getLastRow() - 1, 0)
    const ids = n ? sh.getRange(2, 1, n, 1).getValues().map((r) => String(r[0])) : []
    const row = ids.indexOf(uid)
    const now = new Date()
    if (row < 0) {
      // строка сразу после последнего пользователя (сводка справа не мешает)
      const at = ids.filter(Boolean).length + 2
      sh.getRange(at, 1, 1, 6).setValues([[uid, clip(data.lang, 5), now, now, 1, clip(data.source, 20) || 'Telegram']])
      return {ok: true, new: true}
    }
    const r = row + 2
    const count = Number(sh.getRange(r, 5).getValue()) || 0
    sh.getRange(r, 2).setValue(clip(data.lang, 5))
    sh.getRange(r, 4, 1, 2).setValues([[now, count + 1]])
    return {ok: true, new: false}
  } finally {
    lock.releaseLock()
  }
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
  if (data.action === 'seen') return json(seen(data))
  if (data.action === 'quizstat') return json(quizStat(data))
  if (data.action === 'quizscore') return json(quizScore(data))
  return json({error: 'unknown action'})
}
