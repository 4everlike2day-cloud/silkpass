import PlacesPage, {placesMeta, placesParams} from '@/views/Places'

// «Что посмотреть»: /<город>/places. Список городов — PLACE_CITIES в lib/places.ts.
export const dynamicParams = false
export const generateStaticParams = placesParams
export async function generateMetadata({params}: {params: Promise<{city: string}>}) {
  return placesMeta("ru", (await params).city)
}
export default async function Page({params}: {params: Promise<{city: string}>}) {
  return <PlacesPage lang="ru" slug={(await params).city} />
}
