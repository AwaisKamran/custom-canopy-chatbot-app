'use client'

import { EditableOption } from '@/lib/types'
import { RadioButtonGroup } from './ui/radio-button-group'
import { useActions, useUIState, useAIState } from 'ai/rsc'

interface ChatWrapperProps {
  options: EditableOption[]
  messageId?: string
  isMultiSelect?: boolean
}

export const ChatRadioButtonWrapper = ({
  options,
  messageId,
  isMultiSelect = false
}: ChatWrapperProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [_, _setAIState] = useAIState()
  const handleSelect = async (options: EditableOption[]) => {
    const message = await submitUserMessage(
      JSON.stringify({
        options: options
      })
    )
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  const handleEdit = async (option: EditableOption) => {
    const message = await submitUserMessage(
      `Edit the values for ${option.name}`
    )
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <RadioButtonGroup
      options={options}
      onSelect={handleSelect}
      onEdit={handleEdit}
      isMultiSelect={isMultiSelect}
      disabled={messageId !== messages.at(-1)?.id}
    />
  )
}
