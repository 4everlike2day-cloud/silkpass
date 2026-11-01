'use client'
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'

export type CartItem = {slug: string; title: string; price: number; qty: number}
type Cart = {
  items: CartItem[]
  count: number
  total: number
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (slug: string, qty: number) => void
  clear: () => void
}

const KEY = 'w2uz-cart'
const Ctx = createContext<Cart | null>(null)

export function CartProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  const save = useCallback((next: CartItem[]) => {
    setItems(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const value = useMemo<Cart>(() => {
    const add: Cart['add'] = (item, qty = 1) => {
      const found = items.find((i) => i.slug === item.slug)
      save(found ? items.map((i) => (i.slug === item.slug ? {...i, qty: i.qty + qty} : i)) : [...items, {...item, qty}])
    }
    const setQty: Cart['setQty'] = (slug, qty) =>
      save(qty <= 0 ? items.filter((i) => i.slug !== slug) : items.map((i) => (i.slug === slug ? {...i, qty} : i)))
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add,
      setQty,
      clear: () => save([]),
    }
  }, [items, save])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
