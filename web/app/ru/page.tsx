import Home from '@/views/Home'

export const metadata = {
  title: {absolute: 'Welcome 2 UZB · Сувенирный паспорт по Узбекистану'},
  description: 'Карманный паспорт для Ташкента, Самарканда, Бухары и Хивы. Соберите оригинальный штамп в каждом городе.',
}

export default function Page() {
  return <Home lang="ru" />
}
