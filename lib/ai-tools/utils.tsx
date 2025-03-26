import { convertToCoreMessages, CoreMessage, ToolContent } from 'ai'
import { BotMessage, UserMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorPickerWrapper } from '@/components/chat-color-picker-wrapper'
import { Chat, ClientMessage, Roles, ToolCallResult } from '@/lib/types'
import { CHAT, IMAGE } from '@/app/constants'
import { isValidJson, nanoid } from '@/lib/utils'
import {
  INITIAL_CHAT_MESSAGE,
  LOGO_MSG_REGEX,
  TOOL_FUNCTIONS
} from './constants'
import { Carousal } from '@/components/carousel'
import { ChatTextInputGroup } from '@/components/chat-text-input-group'
import { ColorLabelPickerSet } from '@/components/color-label-picker-set'
import ChatActionMultiSelector from '@/components/chat-action-multi-selector'

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

const getToolMessage = (content: ToolContent): ClientMessage => {
  const { toolCallId, toolName, result } = content[0]
  const { message, props } = result as ToolCallResult

  const toolComponent = (() => {
    switch (toolName) {
      case TOOL_FUNCTIONS.RENDER_BUTTONS:
        return <ChatRadioButtonWrapper messageId={toolCallId} {...props} />

      case TOOL_FUNCTIONS.RENDER_COLOR_PICKER:
        return <ChatColorPickerWrapper messageId={toolCallId} />

      case TOOL_FUNCTIONS.RENDER_TEXT_INPUT_GROUP:
        return <ChatTextInputGroup messageId={toolCallId} {...props} />

      case TOOL_FUNCTIONS.RENDER_COLOR_LABEL_PICKER_SET:
        return <ColorLabelPickerSet messageId={toolCallId} {...props} />

      case TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS:
        return (
          <>
            <Carousal {...props} />
            <ChatActionMultiSelector {...props} messageId={toolCallId} />
          </>
        )

      default:
        return null
    }
  })()

  return {
    id: toolCallId,
    role: Roles.tool,
    display: (
      <BotMessage key={toolCallId} content={message}>
        {toolComponent}
      </BotMessage>
    )
  }
}

const getClientMessage = (message: CoreMessage): ClientMessage => {
  const { role, content } = message
  const id = nanoid()

  switch (role) {
    case Roles.tool:
      return getToolMessage(content)

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
      currentMessage.role === Roles.user &&
      previousMessage &&
      (previousMessage.content as ToolContent)[0]?.toolName ===
        TOOL_FUNCTIONS.RENDER_COLOR_PICKER &&
      isValidJson(currentMessage.content as string)
    ) {
      currentMessage.content = JSON.parse(
        currentMessage.content as string
      ).colorName
    } else if (
      currentMessage.role === Roles.tool &&
      nextMessage?.role === Roles.user &&
      currentMessage.content[0].toolName !==
        TOOL_FUNCTIONS.RENDER_COLOR_PICKER &&
      isValidJson(nextMessage.content as string)
    ) {
      currentMessage.content = [
        {
          ...currentMessage.content[0],
          result: {
            ...(currentMessage.content[0].result as ToolCallResult),
            props: {
              ...(currentMessage.content[0].result as ToolCallResult).props,
              ...JSON.parse(nextMessage.content as string)
            }
          }
        }
      ]

      i = i + 1
    }
    clientMessages.push(getClientMessage(currentMessage))
    i = i + 1
  }

  return clientMessages
}

export const isLastFileUploadMessage = (message: CoreMessage): boolean => {
  return (
    message?.role === Roles.assistant &&
    LOGO_MSG_REGEX.test(message.content as string)
  )
}

export const customizeCoreMessages = (messages: any[]): CoreMessage[] => {
  const updatedMessages = messages.map(message => {
    if (
      typeof message.content === 'object' &&
      message.content[0] &&
      IMAGE in message.content[0]
    ) {
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
