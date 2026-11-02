import {createHash} from 'node:crypto'
import {existsSync, mkdirSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

// Картинки с чужих серверов (Sanity, сайты из таблицы мест) из Узбекистана грузятся по 1–4 секунды.
// При сборке сайта отдаём вместо них свои копии: /img/<код>.webp на нашем домене (Cloudflare, рядом с посетителем).
// Здесь только запоминаем, какую картинку и какого размера нужно сделать (по файлу на картинку в .img-cache/),
// а скачивает, уменьшает и кладёт в out/img/ скрипт scripts/fetch-images.mjs после `next build`.
// В режиме разработки (next dev, NODE_ENV=development) возвращаем исходную ссылку.

const CACHE = join(process.cwd(), '.img-cache')
const BUILD = process.env.NODE_ENV === 'production' || process.env.LOCAL_IMAGES === '1'

/** Своя копия картинки: ширина w, высота h (если задана — обрезка по центру), формат webp. */
export function localImg(src: string | undefined | null, w: number, h?: number): string {
  // w = 0: ширина по пропорциям (для логотипов, где задана только высота)
  if (!src) return ''
  if (!BUILD || !/^https?:\/\//.test(src)) return src
  const key = createHash('sha1').update(`${src}|${w}|${h || ''}`).digest('hex').slice(0, 16)
  try {
    mkdirSync(CACHE, {recursive: true})
    const f = join(CACHE, `${key}.json`)
    if (!existsSync(f)) writeFileSync(f, JSON.stringify({src, w, h: h || 0}))
  } catch {
    return src
  }
  return `/img/${key}.webp`
}

/** Картинка из Sanity нужного размера (Sanity сам режет, мы только сохраняем копию в webp). */
export const sanityImg = (url: string | undefined | null, w: number, h?: number) =>
  url ? localImg(`${url}?${w ? `w=${w}` : ''}${h ? `${w ? '&' : ''}h=${h}${w ? '&fit=crop' : ''}` : ''}`, w, h) : ''
