import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AI } from '@/app/(chat)/ai'
import { createInitialAIState } from '@/lib/ai-tools/utils'

export const metadata = {
  title: 'Conrad Labs AI Chatbot'
}

export default async function IndexPage() {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={createInitialAIState()}>
      <Chat session={session} missingKeys={missingKeys} />
    </AI>
  )
}
