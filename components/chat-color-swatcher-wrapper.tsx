'use client'

import { useActions, useUIState, useAIState } from 'ai/rsc'
import ColorSwatcher from './color-swatcher'
import { Color } from '@/lib/types'

interface ChatColorSwatcherWrapperProps {
  messageId: string
  color?: Color | null
}

export const ChatColorSwatcherWrapper = ({
  messageId,
  color = null
}: ChatColorSwatcherWrapperProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()

  const handleColorPick = async (color: Color) => {
    const message = await submitUserMessage(JSON.stringify({ color }))
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <ColorSwatcher
      currentColor={color}
      onColorSelect={handleColorPick}
      disabled={messageId !== messages.at(-1)?.id || aiState.loading}
    />
  )
}
