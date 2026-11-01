import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("ru", "delivery")

export default function Page() {
  return <View lang="ru" slug="delivery" />
}
