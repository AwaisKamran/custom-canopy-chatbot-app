'use client'

import ColorPicker from './color-picker'
import { useActions, useUIState, useAIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { nanoid } from '@/lib/utils'
import { Color } from '@/lib/types'

interface ChatColorPickerWrapperProps {
  messageId: string
}

export const ChatColorPickerWrapper = ({
  messageId
}: ChatColorPickerWrapperProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()

  const handleColorPick = async (color: Color) => {
    setMessages((currentConversation: any) => [
      ...currentConversation,
      {
        id: nanoid(),
        role: 'user',
        display: <UserMessage content={JSON.stringify(color)} />
      }
    ])
    const message = await submitUserMessage(JSON.stringify(color))
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <ColorPicker
      onColorSelect={handleColorPick}
      disabled={messageId !== messages.at(-1)?.id || aiState.loading}
    />
  )
}
