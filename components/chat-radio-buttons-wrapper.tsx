'use client'

import { RadioButtonGroup } from './ui/radio-button-group'
import { useActions, useUIState, useAIState } from 'ai/rsc'
import { ClientMessage } from '@/lib/types'

interface ChatWrapperProps {
  options: { name: string; value: string }[]
  selectedOption?: string
  messageId?: string
}

export const ChatRadioButtonWrapper = ({
  options,
  selectedOption,
  messageId
}: ChatWrapperProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()

  const handleSelect = async (option: string) => {
    setMessages((currentMessages: any) =>
      currentMessages.length > 0
        ? [
            ...currentMessages.slice(0, -1),
            {
              ...currentMessages[currentMessages.length - 1],
              selectedOption: option
            }
          ]
        : currentMessages
    )
    const message = await submitUserMessage(option)
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  const message: ClientMessage = messages.find(
    (message: ClientMessage) => message.id === messageId
  )

  return (
    <RadioButtonGroup
      options={options}
      selectedOption={message.selectedOption || selectedOption || ''}
      onSelect={handleSelect}
      disabled={messageId !== messages.at(-1)?.id || aiState.loading}
    />
  )
}
