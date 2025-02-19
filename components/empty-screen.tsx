import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to the Custom Canopy Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          Custom Canopy specializes in creating high-quality, custom-made
          canopies tailored to your exact specifications. Simply answer a few
          questions and receive mockups for your custom canopies that adhere to
          your requirements.
        </p>
      </div>
    </div>
  )
}
