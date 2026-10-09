'use client'
import {useState} from 'react'

// Отправка заявок на /api/lead (функция Cloudflare пересылает их в Telegram).
export async function sendLead(payload: Record<string, unknown>) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(String(res.status))
}

type Field = {id: string; label: string; type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'; required?: boolean; options?: string[]; placeholder?: string}

export default function LeadForm({kind, fields, submitLabel, success}: {kind: string; fields: Field[]; submitLabel: string; success: string}) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    try {
      await sendLead({kind, ...data})
      setState('ok')
      form.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') return <p className="ok">{success}</p>

  return (
    <form className="f" onSubmit={onSubmit}>
      {fields.map((f) => (
        <label key={f.id} className="fl" htmlFor={`${kind}-${f.id}`}>
          {f.label}
          {f.type === 'textarea' ? (
            <textarea id={`${kind}-${f.id}`} name={f.id} required={f.required} placeholder={f.placeholder} />
          ) : f.type === 'select' ? (
            <select id={`${kind}-${f.id}`} name={f.id}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
          ) : (
            <input id={`${kind}-${f.id}`} name={f.id} type={f.type || 'text'} required={f.required} placeholder={f.placeholder} />
          )}
        </label>
      ))}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="row" style={{alignItems: 'center'}}>
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : submitLabel}</button>
        {state === 'error' && <span className="err">Could not send. Please try again or message us on Instagram.</span>}
      </div>
    </form>
  )
}
