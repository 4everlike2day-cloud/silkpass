import Home from '@/views/Home'

export const metadata = {
  title: {absolute: "Welcome 2 UZ · O'zbekiston bo'ylab esdalik pasporti"},
  description: "Toshkent, Samarqand, Buxoro va Xiva uchun cho'ntak pasporti. Har bir shaharda original muhr yig'ing.",
}

export default function Page() {
  return <Home lang="uz" />
}
