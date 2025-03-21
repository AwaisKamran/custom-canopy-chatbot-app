'use client'

import { cn } from '@/lib/utils'
import { useAIState } from 'ai/rsc'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect } from 'react'
import { Session } from '@/lib/types'
import { usePathname } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { CHAT } from '@/app/constants'

export interface ChatProps extends React.ComponentProps<'div'> {
  className?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ className, session, missingKeys }: ChatProps) {
  const path = usePathname()
  const [aiState, _setAIState] = useAIState()
  const [_, setNewChatId] = useLocalStorage('newChatId', aiState.id)
  useEffect(() => {
    if (session?.user) {
      if (!path.includes(CHAT)) {
        window.history.replaceState({}, '', aiState.path)
      }
    }
  }, [aiState.id, path, session?.user])

  useEffect(() => {
    setNewChatId(aiState.id)
  }, [aiState.id])

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
        {aiState.messages.length ? (
          <ChatList isShared={false} session={session} />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        session={session}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
