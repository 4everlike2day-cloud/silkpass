import CartView from './CartView'
import {getCities} from '@/lib/data'

export const metadata = {title: 'Cart'}

export default async function CartPage() {
  const cities = await getCities()
  return (
    <section>
      <div className="wrap" style={{maxWidth: 820}}>
        <p className="label">Cart</p>
        <h1 style={{marginTop: 18, marginBottom: 28}}>Your order</h1>
        <CartView cities={cities.map((c) => c.name)} />
      </div>
    </section>
  )
}
