import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AI } from '@/app/(chat)/ai'

export const metadata = {
  title: 'Conrad Labs AI Chatbot'
}

export default async function IndexPage() {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    <AI>
      <Chat session={session} missingKeys={missingKeys} />
    </AI>
  )
}
