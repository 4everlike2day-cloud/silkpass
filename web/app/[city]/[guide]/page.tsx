import GuidePage, {guideMeta, guideParams} from '@/views/Guide'

export const dynamicParams = false
export const generateStaticParams = guideParams
export async function generateMetadata({params}: {params: Promise<{city: string; guide: string}>}) {
  const {city, guide} = await params
  return guideMeta("en", city, guide)
}
export default async function Page({params}: {params: Promise<{city: string; guide: string}>}) {
  const {city, guide} = await params
  return <GuidePage lang="en" citySlug={city} slug={guide} />
}
