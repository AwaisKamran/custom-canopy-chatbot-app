'use client'

import { cn, nanoid } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useAIState } from 'ai/rsc'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMessage,
  ChatMessage,
  removeMessages,
  setThreadId
} from '@/lib/redux/slice/chat.slice'
import PreviewCarousel from './preview-carousel'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages: ChatMessage[]
  id?: string
  session?: Session
  missingKeys: string[]
  threadId: string
}

export function Chat({
  id,
  initialMessages,
  className,
  session,
  missingKeys,
  threadId
}: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const messages = useSelector((state: any) => state.chat.messages)
  const dispatch = useDispatch()
  const [mockups, setMockups] = useState(null)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (messages.length > 1) {
      dispatch(setThreadId(''))
    }
    if (initialMessages.length > 0) {
      dispatch(removeMessages(true))
    } else {
      dispatch(removeMessages(false))
    }
    if (messages.length === 1) {
      setMockups(null)
    }
  }, [path])

  useEffect(() => {
    dispatch(setThreadId(threadId))
    initialMessages.forEach((message: ChatMessage) => {
      dispatch(addMessage(message))
    })
  }, [initialMessages])

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages?.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    const messagesLength = messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [router])

  useEffect(() => {
    setNewChatId(id)
  })

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {isCarouselOpen ? (
          <PreviewCarousel
            mockups={mockups}
            isOpen={isCarouselOpen}
            onClose={() => setIsCarouselOpen(false)}
          />
        ) : messages?.length ? (
          <ChatList
            initialMessages={initialMessages}
            isShared={false}
            session={session}
          />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        session={session}
        mockups={mockups}
        setIsCarouselOpen={setIsCarouselOpen}
        setMockups={setMockups}
      />
    </div>
  )
}
