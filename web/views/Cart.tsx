import CartView from '@/components/CartView'
import {getCities} from '@/lib/data'
import {t, type Lang} from '@/lib/i18n'

export const cartMeta = (lang: Lang) => ({title: t(lang).cart.label})

export default async function Cart({lang}: {lang: Lang}) {
  const c = t(lang).cart
  const cities = await getCities(lang)
  return (
    <section>
      <div className="wrap" style={{maxWidth: 820}}>
        <p className="label">{c.label}</p>
        <h1 style={{marginTop: 18, marginBottom: 28}}>{c.title}</h1>
        <CartView cities={cities.map((x) => x.name)} lang={lang} />
      </div>
    </section>
  )
}
