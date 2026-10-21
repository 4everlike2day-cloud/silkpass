import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("en", "seller")

export default function Page() {
  return <View lang="en" slug="seller" />
}
