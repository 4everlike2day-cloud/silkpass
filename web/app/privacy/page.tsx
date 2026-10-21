import View, {legalMeta} from '@/views/Legal'

export const metadata = legalMeta("en", "privacy")

export default function Page() {
  return <View lang="en" slug="privacy" />
}
