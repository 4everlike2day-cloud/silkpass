/**
 * Веб-приложение реестра паспортов Welcome 2 UZ.
 * Принимает заявки «Маршрут пройден» с сайта и записывает их в лист «Реестр».
 *
 * Как установить (один раз):
 * 1. Откройте таблицу «Welcome 2 UZB: реестр паспортов» → Расширения → Apps Script.
 * 2. Удалите всё в файле Code.gs и вставьте этот код.
 * 3. В строке SECRET впишите любой длинный пароль (тот же впишете в Cloudflare как REGISTRY_SECRET).
 * 4. Нажмите «Начать развёртывание» → «Новое развёртывание» → тип «Веб-приложение».
 *    Выполнять от имени: «Я». Доступ: «Все». Нажмите «Развернуть» и разрешите доступ к таблице.
 * 5. Скопируйте URL веб-приложения (заканчивается на /exec) и впишите его в Cloudflare как REGISTRY_URL.
 */

const SECRET = 'впишите-сюда-длинный-пароль'
const SHEET = 'Реестр'

// Столбцы листа «Реестр» (номера с 1): A №, I Route complete, J кто поставил, L контакт, M пост,
// N печати по почте, O промокод выдан, Q примечание.
const COL = {passport: 1, routeDate: 9, stampedBy: 10, contact: 12, post: 13, mail: 14, promo: 15, note: 17}

// Номера сравниваются только по буквам и цифрам: «W2-UZ-0012», «w2uz0012» и «W2 UZ 0012» считаются одним номером.
const norm = (v) => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const reply = (status) => ContentService.createTextOutput(JSON.stringify({status})).setMimeType(ContentService.MimeType.JSON)

function doPost(e) {
  let data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return reply('unknown')
  }
  if (data.secret !== SECRET) return reply('unknown')

  const passport = norm(data.passport)
  if (!passport) return reply('unknown')
  const shown = String(data.passport).trim().toUpperCase()
  const today = Utilities.formatDate(new Date(), 'Asia/Tashkent', 'dd.MM.yyyy')
  const note = 'Заявка с сайта ' + today

  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET)
    const last = Math.max(sh.getLastRow(), 1)
    const ids = last > 1 ? sh.getRange(2, COL.passport, last - 1, 1).getValues().map((r) => norm(r[0])) : []
    const idx = ids.indexOf(passport)

    if (idx >= 0) {
      const row = idx + 2
      const get = (c) => String(sh.getRange(row, c).getValue()).trim()
      if (get(COL.promo) === 'Да') return reply('claimed')
      if (get(COL.mail) === 'Да') return reply('mail')
      if (!get(COL.routeDate)) sh.getRange(row, COL.routeDate).setValue(today)
      if (data.contact) sh.getRange(row, COL.contact).setValue(data.contact)
      if (data.post) sh.getRange(row, COL.post).setValue(data.post)
      const old = get(COL.note)
      sh.getRange(row, COL.note).setValue(old ? old + '; ' + note : note)
      return reply('updated')
    }

    // Новый номер: первая пустая строка по столбцу A (столбец «Статус» заполняется формулой сам).
    const empty = ids.indexOf('')
    const row = empty >= 0 ? empty + 2 : last + 1
    const values = new Array(COL.note).fill('')
    values[COL.passport - 1] = shown
    values[COL.routeDate - 1] = today
    values[COL.stampedBy - 1] = 'Заявка с сайта'
    values[COL.contact - 1] = data.contact || ''
    values[COL.post - 1] = data.post || ''
    values[COL.note - 1] = note
    sh.getRange(row, 1, 1, values.length).setValues([values])
    return reply('new')
  } finally {
    lock.releaseLock()
  }
}
