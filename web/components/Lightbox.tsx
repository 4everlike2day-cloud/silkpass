'use client'
import {useCallback, useEffect, useState} from 'react'

// Просмотр фото поверх страницы. Работает для всех ссылок с атрибутом data-zoom.
// Без JavaScript ссылка просто откроет картинку, как раньше.
type Shot = {src: string; alt: string}

export default function Lightbox({labels}: {labels: {close: string; prev: string; next: string}}) {
  const [list, setList] = useState<Shot[]>([])
  const [i, setI] = useState<number | null>(null)
  const [touchX, setTouchX] = useState<number | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a[data-zoom]') as HTMLAnchorElement | null
      if (!a) return
      e.preventDefault()
      // Листаем только внутри своей группы (data-zoom="photos", data-zoom="scheme"...).
      const group = a.getAttribute('data-zoom') || ''
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-zoom]')).filter((l) => (l.getAttribute('data-zoom') || '') === group)
      setList(links.map((l) => ({src: l.href, alt: l.querySelector('img')?.alt || ''})))
      setI(links.indexOf(a))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const close = useCallback(() => setI(null), [])
  const step = useCallback((d: number) => setI((x) => (x == null ? x : (x + d + list.length) % list.length)), [list.length])

  useEffect(() => {
    if (i == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [i, close, step])

  if (i == null || !list[i]) return null
  const shot = list[i]
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.alt} onClick={close}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX == null) return
        const dx = e.changedTouches[0].clientX - touchX
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        setTouchX(null)
      }}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={shot.src} alt={shot.alt} />
        {(shot.alt || list.length > 1) && (
          <figcaption>{shot.alt}{list.length > 1 && <span> · {i + 1} / {list.length}</span>}</figcaption>
        )}
      </figure>
      <button className="lb-close" onClick={close} aria-label={labels.close}>×</button>
      {list.length > 1 && (
        <>
          <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label={labels.prev}>‹</button>
          <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label={labels.next}>›</button>
        </>
      )}
    </div>
  )
}
