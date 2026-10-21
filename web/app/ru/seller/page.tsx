import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("ru", "seller")

export default function Page() {
  return <View lang="ru" slug="seller" />
}
