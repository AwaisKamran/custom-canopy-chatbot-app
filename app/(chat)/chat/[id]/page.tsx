import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/actions'
import { Chat as UserChatMessage, Session, ChatResponse } from '@/lib/types'
import { ChatMessage, Roles } from '@/lib/redux/slice/chat.slice'
import { Error401Response } from '@/app/constants'
import { Chat } from '@/components/chat'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const existingChat = await getChat(params.id, session.user.id)
  let chat: UserChatMessage
  if (!existingChat || Error401Response.message in existingChat) {
    redirect('/')
  } else {
    chat = existingChat as UserChatMessage
    return {
      title: chat?.title.toString().slice(0, 50) ?? 'Chat'
    }
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const userId = session.user.id as string
  let existingChat: ChatResponse = await getChat(params.id, userId)

  if (!existingChat || Error401Response.message in existingChat) {
    redirect('/')
  } else {
    existingChat = existingChat as UserChatMessage
    if (existingChat?.userId !== session?.user?.id) {
      notFound()
    }

    const { id, title } = existingChat as UserChatMessage
    const updatedChats: ChatMessage[] = existingChat.messages
      ? existingChat.messages
      : [
          {
            id: id,
            message: title,
            role: Roles.user
          }
        ]
    const threadId = existingChat.threadId || ''

    return (
      <Chat
        id={existingChat.id}
        session={session}
        initialMessages={updatedChats}
        missingKeys={missingKeys}
        threadId={threadId}
      />
    )
  }
}
