import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("ru", "promo-terms")

export default function Page() {
  return <View lang="ru" slug="promo-terms" />
}
