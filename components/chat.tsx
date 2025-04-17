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

export interface ChatProps extends React.ComponentProps<'div'> {
  className?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ className, session, missingKeys }: ChatProps) {
  const [aiState, _setAIState] = useAIState()
  const [_, setNewChatId] = useLocalStorage('newChatId', aiState.id)

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
        {aiState.messages.length ? <ChatList /> : <EmptyScreen />}
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
