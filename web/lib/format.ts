export const pad = (n: number) => String(n).padStart(2, '0')
export const formatPrice = (n: number | null) =>
  n == null ? 'Price coming soon' : `${n.toLocaleString('en-US').replace(/,/g, ' ')} UZS`
