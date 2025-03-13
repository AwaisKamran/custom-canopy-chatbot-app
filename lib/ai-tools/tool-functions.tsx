import React from 'react'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorPickerWrapper } from '@/components/chat-color-picker-wrapper'
import { z } from 'zod'
import {
  ButtonToolSchema,
  ColorPickerToolSchema,
  CustomCanopyToolSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { generateTentMockupsApi } from '../redux/apis/tent-mockup-prompt'
import { Roles, TentMockUpPrompt } from '../types'
import { TOOL_FUNCTIONS } from './constants'
import { modifyAIState } from './utils'
import { ToolContent } from 'ai'

export function renderButtonsTool(history: any, messageId: string) {
  return {
    description: 'Renders the buttons for user selection',
    parameters: ButtonToolSchema,
    generate: async function ({
      content,
      options
    }: z.infer<typeof ButtonToolSchema>) {
      const message = content.join('\n')
      modifyAIState(history, {
        role: Roles.tool,
        content: [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.RENDER_BUTTONS,
            result: {
              message,
              props: { options }
            }
          }
        ] as ToolContent
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      return (
        <BotMessage
          key={messageId}
          content={message}
          children={
            <ChatRadioButtonWrapper options={options} messageId={messageId} />
          }
        />
      )
    }
  }
}

export function renderColorPickerTool(history: any, messageId: string) {
  return {
    description: 'Renders the color picker for user selection',
    parameters: ColorPickerToolSchema,
    generate: async function ({
      content
    }: z.infer<typeof ColorPickerToolSchema>) {
      const message = content.join('\n')
      modifyAIState(history, {
        role: Roles.tool,
        content: [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.RENDER_COLOR_PICKER,
            result: {
              message
            }
          }
        ] as ToolContent
      })
      await new Promise(resolve => setTimeout(resolve, 1000))

      return (
        <BotMessage
          key={messageId}
          content={message}
          children={<ChatColorPickerWrapper messageId={messageId} />}
        />
      )
    }
  }
}

export function generateCanopyMockups(history: any, messageId: string) {
  return {
    description: 'Generates the images for canopy tents based on user details',
    parameters: CustomCanopyToolSchema,
    generate: async function* ({
      content,
      payload
    }: z.infer<typeof CustomCanopyToolSchema>) {
      yield <BotCard>{content[0]}</BotCard>
      try {
        const mockups = await generateTentMockupsApi({
          ...(payload as TentMockUpPrompt),
          id: history.get().id
        })
        modifyAIState(history, {
          role: Roles.tool,
          content: [
            {
              toolCallId: messageId,
              toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
              result: {
                message: content[1],
                props: { mockups }
              }
            }
          ] as ToolContent
        })
        return (
          <BotMessage
            content={content[1]}
            children={<Carousal mockups={mockups} />}
          />
        )
      } catch (error) {
        return (
          <BotCard>
            <div>{(error as Error).message}</div>
          </BotCard>
        )
      }
    }
  }
}

export const getToolFunctions = (history: any, messageId: string) => {
  return {
    renderButtons: renderButtonsTool(history, messageId),
    renderColorPicker: renderColorPickerTool(history, messageId),
    generateCanopyMockups: generateCanopyMockups(history, messageId)
  }
}
