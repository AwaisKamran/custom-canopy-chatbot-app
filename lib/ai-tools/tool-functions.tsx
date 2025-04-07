import React from 'react'
import { z } from 'zod'
import { ToolContent } from 'ai'
import {
  ButtonToolSchema,
  ColorPickerToolSchema,
  CustomCanopyToolSchema,
  ChatTextInputGroupSchema,
  RegionsColorsManagerSchema,
  ColorLabelPickerSetSchema,
  AddOnSchema,
  UserInteractionTrackingSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorPickerWrapper } from '@/components/chat-color-picker-wrapper'
import { generateTentMockupsApi } from '../redux/apis/tent-mockup-prompt'
import { MockupResponse, Roles, TentMockUpPrompt } from '../types'
import { TOOL_FUNCTIONS } from './constants'
import { modifyAIState } from './utils'
import { ChatTextInputGroup } from '@/components/chat-text-input-group'
import ChatActionMultiSelector from '@/components/chat-action-multi-selector'
import RegionsColorsManager from '@/components/regions_colors_manager'
import { ColorLabelPickerSet } from '@/components/color-label-picker-set'
import { trackAnalyticsEvent } from '@/app/actions/trackAnalytics'
import { AddOnType, EventTypes } from '../types/ga'
import { cookies } from 'next/headers'

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
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_BUTTONS,
          result: {
            message: content,
            props: { options }
          }
        }
      ] as ToolContent)

      return (
        <BotMessage key={messageId} content={content}>
          <ChatRadioButtonWrapper options={options} messageId={messageId} />
        </BotMessage>
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
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_COLOR_PICKER,
          result: {
            message: content
          }
        }
      ] as ToolContent)

      return (
        <BotMessage key={messageId} content={content}>
          <ChatColorPickerWrapper messageId={messageId} />
        </BotMessage>
      )
    }
  }
}

export function renderTextInputGroup(history: any, messageId: string) {
  return {
    description: 'Renders the text input with label for user input',
    parameters: ChatTextInputGroupSchema,
    generate: async function ({
      content,
      inputFields
    }: z.infer<typeof ChatTextInputGroupSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_TEXT_INPUT_GROUP,
          result: {
            message: content,
            props: { inputFields }
          }
        }
      ] as ToolContent)

      return (
        <BotMessage key={messageId} content={content}>
          <ChatTextInputGroup inputFields={inputFields} messageId={messageId} />
        </BotMessage>
      )
    }
  }
}

export function renderColorLabelPickerSet(history: any, messageId: string) {
  return {
    description: 'Renders the multi color picker with label for user input',
    parameters: ColorLabelPickerSetSchema,
    generate: async function ({
      content,
      fieldColors
    }: z.infer<typeof ColorLabelPickerSetSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_COLOR_LABEL_PICKER_SET,
          result: {
            message: content,
            props: { fieldColors }
          }
        }
      ] as ToolContent)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return (
        <BotMessage key={messageId} content={content}>
          <ColorLabelPickerSet
            fieldColors={fieldColors}
            messageId={messageId}
          />
        </BotMessage>
      )
    }
  }
}

export function renderRegionManager(history: any, messageId: string) {
  return {
    description: 'Renders the multi color picker with label for user input',
    parameters: RegionsColorsManagerSchema,
    generate: async function ({
      content,
      regions
    }: z.infer<typeof RegionsColorsManagerSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_REGION_MANAGER,
          result: {
            message: content,
            props: { regions }
          }
        }
      ] as ToolContent)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return (
        <BotMessage key={messageId} content={content}>
          <RegionsColorsManager regions={regions} messageId={messageId} />
        </BotMessage>
      )
    }
  }
}
export function getAddOns(history: any, messageId: string) {
  return {
    description: 'Renders the add-ons options for the canopy',
    parameters: AddOnSchema,
    generate: async function ({
      content,
      options
    }: z.infer<typeof AddOnSchema>) {
      try {
        modifyToolAIState(history, [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.GET_ADD_ONS,
            result: {
              message: content,
              props: {
                options,
                selectorName: 'Add-Ons'
              }
            }
          }
        ] as ToolContent)
        return (
          <BotMessage content={content}>
            <ChatActionMultiSelector
              selectorName="Add-Ons"
              options={options}
              messageId={messageId}
            />
          </BotMessage>
        )
      } catch (err) {
        const error = (err as Error).message
        modifyToolAIState(history, [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.GET_ADD_ONS,
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

export function generateCanopyMockups(
  history: any,
  messageId: string,
  userId: string
) {
  return {
    description: 'Generates the images for canopy tents based on user details',
    parameters: CustomCanopyToolSchema,
    generate: async function* ({
      content,
      options,
      payload
    }: z.infer<typeof CustomCanopyToolSchema>) {
      yield <BotCard>{content[0]}</BotCard>
      try {
        const { addOns, ...rest } = payload
        const mockups: MockupResponse = await generateTentMockupsApi({
          ...(rest as TentMockUpPrompt),
          id: history.get().id
        })
        modifyToolAIState(history, [
          {
            toolCallId: messageId,
            toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
            result: {
              message: content[1],
              props: {
                mockups,
                options,
                action: 'Place Order',
                selectorName: 'Add-Ons'
              }
            }
          }
        ] as ToolContent)
        setTimeout(async () => {
          try {
            await trackAnalyticsEvent({
              event: EventTypes.MOCKUP_GENERATED,
              context: { chatId: history.get().id, messageId, userId },
              data: {
                companyName: rest.companyName,
                canopyType: rest.tentType,
                addOns: addOns as AddOnType[]
              }
            })
          } catch (error) {
            console.error('Error tracking analytics event:', error)
          }
        }, 0)
        return (
          <BotMessage content={content[1]}>
            <Carousal mockups={mockups} open={true} />
            <ChatActionMultiSelector
              action="Place Order"
              selectorName="Add-Ons"
              options={options}
              messageId={messageId}
            />
          </BotMessage>
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

export function trackUserEvent(
  history: any,
  messageId: string,
  userId: string
) {
  return {
    description: 'Track user event',
    parameters: UserInteractionTrackingSchema,
    generate: async ({
      content,
      event,
      inputs
    }: z.infer<typeof UserInteractionTrackingSchema>) => {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
          result: {
            message: content
          }
        }
      ] as ToolContent)
      setTimeout(async () => {
        await trackAnalyticsEvent({
          event,
          context: { chatId: history.get().id, userId },
          data: inputs.map(input => {
            return {
              [input.name]: input.value
            }
          })
        })
      }, 1000)
      return <BotMessage content={content} />
    }
  }
}

export const getToolFunctions = (
  history: any,
  messageId: string,
  userId: string
) => {
  return {
    renderButtons: renderButtonsTool(history, messageId),
    renderColorPicker: renderColorPickerTool(history, messageId),
    renderColorLabelPickerSet: renderColorLabelPickerSet(history, messageId),
    renderRegionManager: renderRegionManager(history, messageId),
    renderTextInputGroup: renderTextInputGroup(history, messageId),
    generateCanopyMockups: generateCanopyMockups(history, messageId, userId),
    getAddOns: getAddOns(history, messageId),
    trackUserEvent: trackUserEvent(history, messageId, userId)
  }
}
