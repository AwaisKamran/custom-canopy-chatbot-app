import { clearChats, getChats } from '@/app/actions'
import { Error401Response } from '@/app/constants'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { Chat } from '@/lib/types'
import { redirect } from 'next/navigation'
import { cache } from 'react'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)

  if (!chats || Error401Response.message in chats) {
    redirect('/')
  } else {
    const chatsArray = chats as Chat[]
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {chatsArray?.length ? (
            <div className="space-y-2 px-2">
              <SidebarItems chats={chatsArray} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No chat history</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <ThemeToggle />
          <ClearHistory
            clearChats={clearChats}
            isEnabled={chatsArray?.length > 0}
          />
        </div>
      </div>
    )
  }
}
