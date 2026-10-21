import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("ru", "privacy")

export default function Page() {
  return <View lang="ru" slug="privacy" />
}
