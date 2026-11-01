'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {href, splitPath, t} from '@/lib/i18n'

export default function NotFound() {
  const {lang} = splitPath(usePathname() || '/')
  const d = t(lang).notFound
  return (
    <section>
      <div className="wrap">
        <p className="label">404</p>
        <h1 style={{marginTop: 18}}>{d.title}</h1>
        <p className="muted" style={{marginTop: 18}}>{d.text}</p>
        <div className="row" style={{marginTop: 24}}><Link className="btn" href={href(lang, '/')}>{d.go}</Link></div>
      </div>
    </section>
  )
}
