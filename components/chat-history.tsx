'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'

interface ChatHistoryProps {
  userId?: string
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const router = useRouter()
  const showLogin = !userId

  return (
    <div className="relative h-full">
      {showLogin && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
          <Button
            onClick={() => router.push('/login')}
            className="bg-background text-foreground"
          >
            Log In to View Chat History
          </Button>
        </div>
      )}

      <div
        className={cn(
          'flex flex-col h-full',
          showLogin ? 'pointer-events-none' : ''
        )}
      >
        <div className="mb-2 px-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-10 w-full justify-start bg-action-button text-action-button-foreground px-4 shadow-none transition-colors hover:bg-action-button'
            )}
          >
            <IconPlus className="-translate-x-2 stroke-2" />
            New Chat
          </Link>
        </div>
        <React.Suspense
          fallback={
            <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          }
        >
          {/* @ts-ignore */}
          <SidebarList userId={userId} />
        </React.Suspense>
      </div>
    </div>
  )
}
