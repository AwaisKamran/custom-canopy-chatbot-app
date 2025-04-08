import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/actions'
import { Chat as UserChatMessage, Session } from '@/lib/types'
import { Error401Response } from '@/app/constants'
import { Chat } from '@/components/chat'
import { AI } from '@/app/(chat)/ai'

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  const userId = session?.user.id
  if (!userId) {
    redirect('/')
  }
  let existingChat = await getChat(params.id, userId)

  if (!existingChat || Error401Response.message in existingChat) {
    redirect('/')
  } else {
    existingChat = existingChat as UserChatMessage
    if (existingChat?.userId !== session?.user?.id) {
      notFound()
    }
    return (
      <AI initialAIState={existingChat}>
        <Chat session={session} missingKeys={missingKeys} />
      </AI>
    )
  }
}
