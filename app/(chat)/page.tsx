import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Conrad Labs AI Chatbot'
}

export default async function IndexPage() {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  if (!session) {
    redirect('/login')
  }

  return <Chat session={session} missingKeys={missingKeys} />
}
