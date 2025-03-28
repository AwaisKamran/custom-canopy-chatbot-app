'use client'

import React from 'react'
import { useActions, useUIState, useAIState } from 'ai/rsc'
import { ChatRadioButtonWrapper } from './chat-radio-buttons-wrapper'

interface ChatActionMultiSelectorProps {
  action: string
  selectorName: string
  options: { name: string; value: string; selected: boolean; edit: boolean }[]
  messageId?: string
}

const ChatActionMultiSelector: React.FC<ChatActionMultiSelectorProps> = ({
  action,
  selectorName,
  options,
  messageId
}) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()

  const handleActionClick = async () => {
    const message = await submitUserMessage(action)
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <>
      <button
        className="chat-button"
        onClick={handleActionClick}
        disabled={messageId !== messages.at(-1)?.id || aiState.loading}
      >
        {action}
      </button>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <span className="text-zinc-600 dark:text-white font-semibold">
        Select {selectorName}
      </span>
      <ChatRadioButtonWrapper
        isMultiSelect={true}
        options={options}
        messageId={messageId}
      />
    </>
  )
}

export default ChatActionMultiSelector
