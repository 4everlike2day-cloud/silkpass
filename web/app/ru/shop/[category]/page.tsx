import {CategoryPage, categoryMeta, categoryParams} from '@/views/Shop'

export const dynamicParams = false
export const generateStaticParams = categoryParams
export async function generateMetadata({params}: {params: Promise<{category: string}>}) {
  return categoryMeta("ru", (await params).category)
}
export default async function Page({params}: {params: Promise<{category: string}>}) {
  return <CategoryPage lang="ru" category={(await params).category} />
}
