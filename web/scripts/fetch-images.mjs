// После `next build`: скачивает картинки, отмеченные lib/img.ts (папка .img-cache/), уменьшает их,
// сохраняет в out/img/<код>.webp. Если картинку скачать не удалось, в out/_redirects добавляется
// переадресация на исходную ссылку — посетитель всё равно её увидит (как раньше, только медленнее).
import {readdir, readFile, writeFile, mkdir, appendFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import sharp from 'sharp'

const CACHE = '.img-cache'
const OUT = 'out/img'
if (!existsSync(CACHE)) {
  console.log('images: nothing to do')
  process.exit(0)
}
await mkdir(OUT, {recursive: true})
const jobs = (await readdir(CACHE)).filter((f) => f.endsWith('.json'))
let ok = 0
const failed = []

async function one(file) {
  const key = file.replace('.json', '')
  const {src, w, h} = JSON.parse(await readFile(join(CACHE, file), 'utf8'))
  try {
    const res = await fetch(src, {
      headers: {'User-Agent': 'Mozilla/5.0 (welcome2.uz site build)', Accept: 'image/jpeg,image/png,image/*;q=0.8'},
      signal: AbortSignal.timeout(30000),
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const img = sharp(buf, {failOn: 'none'}).rotate()
    const resized = h && w
      ? img.resize(w, h, {fit: 'cover', position: 'attention', withoutEnlargement: true})
      : img.resize(w || null, h || null, {fit: 'inside', withoutEnlargement: true})
    await writeFile(join(OUT, `${key}.webp`), await resized.webp({quality: 78, effort: 5}).toBuffer())
    ok++
  } catch (e) {
    failed.push([key, src, String(e.message || e)])
  }
}

// по 6 загрузок одновременно
for (let i = 0; i < jobs.length; i += 6) await Promise.all(jobs.slice(i, i + 6).map(one))

if (failed.length) {
  await appendFile('out/_redirects', failed.map(([k, s]) => `/img/${k}.webp ${s} 302`).join('\n') + '\n')
  failed.forEach(([, s, e]) => console.warn(`images: not saved (${e}): ${s}`))
}
console.log(`images: ${ok} saved, ${failed.length} left as links`)
