import Link from 'next/link'

export default function NotFound() {
  return (
    <section>
      <div className="wrap">
        <p className="label">404</p>
        <h1 style={{marginTop: 18}}>Page not found</h1>
        <p className="muted" style={{marginTop: 18}}>This page does not exist. Start from the route.</p>
        <div className="row" style={{marginTop: 24}}><Link className="btn" href="/">Go to the route</Link></div>
      </div>
    </section>
  )
}
