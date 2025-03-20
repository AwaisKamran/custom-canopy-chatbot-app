import React from 'react'
import { z } from 'zod'
import { ToolContent } from 'ai'
import {
  ButtonToolSchema,
  ColorPickerToolSchema,
  CustomCanopyToolSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorPickerWrapper } from '@/components/chat-color-picker-wrapper'
import { generateTentMockupsApi } from '../redux/apis/tent-mockup-prompt'
import { Roles, TentMockUpPrompt } from '../types'
import { TOOL_FUNCTIONS } from './constants'
import { modifyAIState } from './utils'

function modifyToolAIState(history: any, content: ToolContent) {
  modifyAIState(history, {
    role: Roles.tool,
    content
  })
}

export function renderButtonsTool(history: any, messageId: string) {
  return {
    description: 'Renders the buttons for user selection',
    parameters: ButtonToolSchema,
    generate: async function ({
      content,
      options
    }: z.infer<typeof ButtonToolSchema>) {
      const message = content.join('\n')
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_BUTTONS,
          result: {
            message,
            props: { options }
          }
        }
      ] as ToolContent)

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
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_COLOR_PICKER,
          result: {
            message
          }
        }
      ] as ToolContent)
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
        const mockups: { fileName: string; data: string }[] =
          await generateTentMockupsApi({
            ...(payload as TentMockUpPrompt),
            id: history.get().id
          })
        // modifyToolAIState(history, [
        //   {
        //     toolCallId: messageId,
        //     toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
        //     result: {
        //       message: content[1],
        //       props: { mockups }
        //     }
        //   }
        // ] as ToolContent)
        return (
          <BotMessage
            content={content[1]}
            children={<Carousal mockups={mockups} />}
          />
        )
      } catch (err) {
        const error = (err as Error).message
        modifyToolAIState(history, [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
            result: {
              message: error
            }
          }
        ] as ToolContent)
        return <BotCard>{error}</BotCard>
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
