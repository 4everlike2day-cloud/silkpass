import Link from 'next/link'
import type {Category} from '@/lib/types'

export default function CategoryNav({cats, current}: {cats: Category[]; current?: string}) {
  return (
    <nav className="cats" aria-label="Categories">
      <Link href="/shop" aria-current={!current ? 'page' : undefined}>All</Link>
      {cats.map((c) => <Link key={c.slug} href={`/shop/${c.slug}`} aria-current={current === c.slug ? 'page' : undefined}>{c.title}</Link>)}
    </nav>
  )
}
