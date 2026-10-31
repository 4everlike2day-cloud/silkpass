'use client'
import {useState} from 'react'
import {CATEGORIES} from '@/lib/places'
import {t, type Lang} from '@/lib/i18n'

type Texts = {name: string; category: string; categoryAny: string; description: string; link: string; location: string; contact: string; send: string; ok: string; hint: string}

// Форма «Предложить место»: уходит на /api/places → лист «Предложения» и уведомление в Telegram.
export default function PlaceSuggest({lang, city, tx}: {lang: Lang; city: string; tx: Texts}) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      const res = await fetch('/api/places', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, city, lang})})
      if (!res.ok) throw new Error(String(res.status))
      setState('ok')
      form.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') return <p className="ok">{tx.ok}</p>

  return (
    <form className="f" onSubmit={onSubmit}>
      <label className="fl" htmlFor="ps-name">{tx.name} *
        <input id="ps-name" name="name" required minLength={2} maxLength={120} />
      </label>
      <label className="fl" htmlFor="ps-category">{tx.category}
        <select id="ps-category" name="category" defaultValue="">
          <option value="">{tx.categoryAny}</option>
          {CATEGORIES.map((c) => <option key={c.ru} value={c.ru}>{c.i} {lang === 'ru' ? c.ru : c[lang]}</option>)}
        </select>
      </label>
      <label className="fl" htmlFor="ps-description">{tx.description}
        <textarea id="ps-description" name="description" maxLength={1000} />
      </label>
      <label className="fl" htmlFor="ps-link">{tx.link}
        <input id="ps-link" name="link" type="url" placeholder="https://" maxLength={300} />
      </label>
      <label className="fl" htmlFor="ps-location">{tx.location}
        <input id="ps-location" name="location" type="url" placeholder="https://maps.google.com/…" maxLength={300} />
      </label>
      <label className="fl" htmlFor="ps-contact">{tx.contact}
        <input id="ps-contact" name="contact" maxLength={120} />
      </label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="muted" style={{fontSize: '.88rem'}}>{tx.hint}</p>
      <div className="row" style={{alignItems: 'center'}}>
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t(lang).sending : tx.send}</button>
        {state === 'error' && <span className="err">{t(lang).formError}</span>}
      </div>
    </form>
  )
}
