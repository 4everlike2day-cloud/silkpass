import CityPage, {cityMeta, cityParams} from '@/views/City'

// Адреса городов (/tashkent, /samarkand…) зашиты в QR-кодах паспорта. Не переименовывайте их после печати.
export const dynamicParams = false
export const generateStaticParams = cityParams
export async function generateMetadata({params}: {params: Promise<{city: string}>}) {
  return cityMeta("uz", (await params).city)
}
export default async function Page({params}: {params: Promise<{city: string}>}) {
  return <CityPage lang="uz" slug={(await params).city} />
}
