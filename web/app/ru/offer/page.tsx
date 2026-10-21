import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("ru", "offer")

export default function Page() {
  return <View lang="ru" slug="offer" />
}
