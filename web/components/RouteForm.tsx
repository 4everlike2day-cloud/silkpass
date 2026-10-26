'use client'
import {useRef, useState} from 'react'
import Link from 'next/link'
import {href, t, type Lang} from '@/lib/i18n'

// Форма «Маршрут пройден» на странице /reward. Отправляет данные, выбранный подарок и фото страницы Route complete на /api/route-complete.
// Фото перед отправкой уменьшается в браузере до 1800 px по длинной стороне, чтобы загрузка была быстрой.

type Result = 'new' | 'updated' | 'claimed' | 'mail' | 'unknown'
const MAX_SIDE = 1800

async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * k)
    canvas.height = Math.round(bmp.height * k)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/jpeg', 0.85))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file // например, HEIC в браузере без поддержки: отправляем как есть
  }
}

export default function RouteForm({lang, gifts = []}: {lang: Lang; gifts?: {id: string; title: string}[]}) {
  const f = t(lang).reward.form
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<Result | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [photoErr, setPhotoErr] = useState(false)
  const photo = useRef<File | null>(null)

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setPhotoErr(false)
    if (preview) URL.revokeObjectURL(preview)
    if (file && (!file.type.startsWith('image/') || file.size > 20 * 1024 * 1024)) {
      photo.current = null
      setPreview(null)
      setPhotoErr(true)
      e.target.value = ''
      return
    }
    photo.current = file
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!photo.current) {
      setPhotoErr(true)
      return
    }
    const form = new FormData(e.currentTarget)
    form.delete('photo')
    const blob = await shrink(photo.current)
    if (blob.size > 8 * 1024 * 1024) {
      setPhotoErr(true)
      return
    }
    form.set('photo', blob, 'page17.jpg')
    form.set('lang', lang)
    setState('sending')
    try {
      const res = await fetch('/api/route-complete', {method: 'POST', body: form})
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as {status?: Result}
      setResult(data.status || 'unknown')
      setState('idle')
    } catch {
      setState('error')
    }
  }

  if (result) {
    const blocked = result === 'claimed' || result === 'mail'
    return (
      <div className="route-done" role="status">
        <p className={blocked ? 'err' : 'ok'}>{blocked ? (result === 'mail' ? f.mail : f.claimed) : f.ok}</p>
      </div>
    )
  }

  return (
    <form className="f route-form" onSubmit={onSubmit}>
      <label className="fl" htmlFor="rc-passport">
        {f.passport}
        <input id="rc-passport" name="passport" required minLength={3} maxLength={40} placeholder="W2-UZ-0001" autoComplete="off" />
      </label>

      {gifts.length > 0 && (
        <label className="fl" htmlFor="rc-gift">
          {f.gift}
          <select id="rc-gift" name="gift" required defaultValue="">
            <option value="" disabled>{f.giftPick}</option>
            {gifts.map((g) => <option key={g.id} value={g.title}>{g.title}</option>)}
          </select>
        </label>
      )}

      <div className="fl">
        <span>{f.photo}</span>
        <label className={`photo-drop${preview ? ' has' : ''}`} htmlFor="rc-photo">
          {preview ? <img src={preview} alt="" /> : <span className="muted">{f.photoPick}</span>}
        </label>
        <input id="rc-photo" className="visually-hidden" name="photo" type="file" accept="image/*" onChange={onPhoto} />
        <span className={photoErr ? 'err small' : 'muted small'}>{photoErr ? f.photoError : f.photoHint}</span>
      </div>

      <label className="fl" htmlFor="rc-contact">
        {f.contact}
        <input id="rc-contact" name="contact" required maxLength={120} placeholder="@username, +998 …" />
      </label>

      <label className="fl" htmlFor="rc-post">
        {f.post}
        <input id="rc-post" name="post" type="url" maxLength={300} placeholder="https://instagram.com/p/…" />
        <span className="muted small">{f.postHint}</span>
      </label>

      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>{f.consent} <Link href={href(lang, '/privacy')}>{t(lang).legal.names.privacy}</Link></span>
      </label>

      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="row" style={{alignItems: 'center'}}>
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t(lang).sending : f.send}</button>
        {state === 'error' && <span className="err">{f.error}</span>}
      </div>
    </form>
  )
}
