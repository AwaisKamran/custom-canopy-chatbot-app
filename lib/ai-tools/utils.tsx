import { convertToCoreMessages, CoreMessage, ToolContent } from 'ai'
import { BotMessage, UserMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorPickerWrapper } from '@/components/chat-color-picker-wrapper'
import { Chat, ClientMessage, Roles, ToolCallResult } from '@/lib/types'
import { CHAT, IMAGE } from '@/app/constants'
import { getRGBColorName, nanoid } from '@/lib/utils'
import {
  INITIAL_CHAT_MESSAGE,
  LOGO_MSG_REGEX,
  TOOL_FUNCTIONS
} from './constants'
import { Carousal } from '@/components/carousel'

const createInitialAIState = (): Chat => {
  const chatId = nanoid()
  return {
    id: chatId,
    title: '',
    messages: [
      {
        role: Roles.assistant,
        content: INITIAL_CHAT_MESSAGE
      }
    ],
    path: `/${CHAT}/${chatId}`,
    createdAt: new Date(),
    loading: false
  }
}

const createInitialUIState = (): ClientMessage[] => {
  const messageId = nanoid()
  return [
    {
      id: messageId,
      role: Roles.assistant,
      display: <BotMessage key={messageId} content={INITIAL_CHAT_MESSAGE} />
    }
  ]
}

const modifyAIState = (
  history: any,
  message: CoreMessage,
  finalize: boolean = true
) => {
  const currentHistory = history.get()

  const newHistory = {
    ...currentHistory,
    title:
      currentHistory.title || (message.content as string).substring(0, 100),
    messages: [...currentHistory.messages, message],
    loading: !finalize
  }
  if (finalize) {
    history.done(newHistory)
  } else {
    history.update(newHistory)
  }
}

const getToolMessage = (
  content: ToolContent,
  selectedOption?: string
): ClientMessage => {
  const { toolCallId, toolName, result } = content[0]
  const { message, props } = result as ToolCallResult
  const toolComponent = (() => {
    switch (toolName) {
      case TOOL_FUNCTIONS.RENDER_BUTTONS:
        return (
          <ChatRadioButtonWrapper
            selectedOption={selectedOption}
            messageId={toolCallId}
            {...props}
          />
        )

      case TOOL_FUNCTIONS.RENDER_COLOR_PICKER:
        return <ChatColorPickerWrapper messageId={toolCallId} />

      default:
        if (props) {
          return <Carousal {...props} />
        }
        return null
    }
  })()

  return {
    id: toolCallId,
    role: Roles.tool,
    display: (
      <BotMessage key={toolCallId} content={message} children={toolComponent} />
    )
  }
}

const getClientMessage = (
  message: CoreMessage,
  selectedOption?: string
): ClientMessage => {
  const { role, content } = message
  const id = nanoid()
  switch (role) {
    case Roles.tool:
      return getToolMessage(content as ToolContent, selectedOption)
    case Roles.assistant:
      return {
        id,
        role: Roles.assistant,
        display: <BotMessage key={id} content={content as string} />
      }
    default:
      return {
        id,
        role: Roles.user,
        display: <UserMessage key={id} content={content as string} />
      }
  }
}

const getClientMessages = (messages: CoreMessage[]): ClientMessage[] => {
  const clientMessages: ClientMessage[] = []
  let i = 0

  while (i < messages.length) {
    const currentMessage = messages[i]
    const nextMessage = messages[i + 1]
    const previousMessage = messages[i - 1]

    if (
      currentMessage.role === Roles.tool &&
      nextMessage?.role === Roles.user
    ) {
      const toolContent = currentMessage.content as ToolContent
      if (toolContent[0].toolName === TOOL_FUNCTIONS.RENDER_BUTTONS) {
        clientMessages.push(
          getClientMessage(currentMessage, nextMessage.content as string)
        )
        i += 2
        continue
      }
    }

    if (
      currentMessage.role === Roles.user &&
      i - 1 >= 0 &&
      (previousMessage.content as ToolContent)[0]?.toolName ===
        TOOL_FUNCTIONS.RENDER_COLOR_PICKER
    ) {
      currentMessage.content = getRGBColorName(
        currentMessage.content as string
      ) as string
    }
    clientMessages.push(getClientMessage(currentMessage))
    i++
  }

  return clientMessages
}

export const isLastFileUploadMessage = (message: CoreMessage): boolean => {
  return (
    message &&
    message.role === Roles.assistant &&
    LOGO_MSG_REGEX.test(message.content as string)
  )
}

export const customizeCoreMessages = (messages: any[]) => {
  const updatedMessages = messages.map(message => {
    if (typeof message.content === 'object' && IMAGE in message.content[0]) {
      message.content = JSON.stringify(message.content)
    }
    return message
  })

  return convertToCoreMessages(updatedMessages)
}

export {
  createInitialUIState,
  createInitialAIState,
  modifyAIState,
  getClientMessages
}
