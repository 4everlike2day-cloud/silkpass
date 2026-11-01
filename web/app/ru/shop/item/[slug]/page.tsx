import {ProductPage, productMeta, productParams} from '@/views/Shop'

export const dynamicParams = false
export const generateStaticParams = productParams
export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  return productMeta("ru", (await params).slug)
}
export default async function Page({params}: {params: Promise<{slug: string}>}) {
  return <ProductPage lang="ru" slug={(await params).slug} />
}
