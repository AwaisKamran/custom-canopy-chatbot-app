'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { Chat as ChatInterface, Session } from '@/lib/types'
import { usePathname } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import PreviewCarousel from './preview-carousel'
import { initiateChat } from '@/lib/redux/slice/chat'
import { AppDispatch, RootState } from '@/lib/redux/store'
import { CHAT } from '@/app/constants'

export interface ChatProps extends React.ComponentProps<'div'> {
  className?: string
  session?: Session
  missingKeys: string[]
  chat?: ChatInterface
}

export function Chat({ className, session, missingKeys, chat }: ChatProps) {
  const path = usePathname()
  const {
    id,
    messages,
    path: chatPath
  } = useSelector((state: any) => state.chatReducer)
  const { generatedMockups } = useSelector(
    (state: RootState) => state.tentMockUpPromptReducer
  )
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const dispatch: AppDispatch = useDispatch()
  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    dispatch(initiateChat(chat))
  }, [])

  useEffect(() => {
    if (session?.user) {
      if (!path.includes(CHAT)) {
        window.history.replaceState({}, '', chatPath)
      }
    }
  }, [id, path, session?.user])

  useEffect(() => {
    setNewChatId(id)
  }, [id])

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
            mockups={generatedMockups}
            isOpen={isCarouselOpen}
            onClose={() => setIsCarouselOpen(false)}
          />
        ) : messages?.length ? (
          <ChatList isShared={false} session={session} />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        session={session}
        setIsCarouselOpen={setIsCarouselOpen}
      />
    </div>
  )
}
