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
  PlaceFinalOrderSchema,
  ShowUserDetailsSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorSwatcherWrapper } from '@/components/chat-color-swatcher-wrapper'
import { generateTentMockupsApi } from '../redux/apis/tent-mockup-prompt'
import { MockupResponse, Roles, TentMockUpPrompt } from '../types'
import { TOOL_FUNCTIONS } from './constants'
import { modifyAIState } from './utils'
import { ChatTextInputGroup } from '@/components/chat-text-input-group'
import ChatActionMultiSelector from '@/components/chat-action-multi-selector'
import RegionsColorsManager from '@/components/regions_colors_manager'
import { ColorLabelPickerSet } from '@/components/color-label-picker-set'
import { UserDetailsForm } from '@/components/user-details-form'

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
      isMultiSelect,
      options
    }: z.infer<typeof ButtonToolSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.RENDER_BUTTONS,
          result: {
            message: content,
            props: { options, isMultiSelect }
          }
        }
      ] as ToolContent)

      return (
        <BotMessage key={messageId} content={content}>
          <ChatRadioButtonWrapper
            options={options}
            isMultiSelect={isMultiSelect}
            messageId={messageId}
          />
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
          <ChatColorSwatcherWrapper messageId={messageId} />
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

export function generateCanopyMockups(history: any, messageId: string) {
  return {
    description: 'Generates the images for canopy tents based on user details',
    parameters: CustomCanopyToolSchema,
    generate: async function* ({
      content,
      options,
      selectorName,
      payload
    }: z.infer<typeof CustomCanopyToolSchema>) {
      yield <BotCard>{content[0]}</BotCard>
      try {
        const mockups: MockupResponse = await generateTentMockupsApi({
          ...(payload as TentMockUpPrompt),
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
                selectorName,
                action: 'Place Order'
              }
            }
          }
        ] as ToolContent)
        return (
          <BotMessage content={content[1]}>
            <Carousal mockups={mockups} open={true} />
            <ChatActionMultiSelector
              action="Place Order"
              selectorName={selectorName}
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

export function placeFinalOrder(history: any, messageId: string) {
  return {
    description:
      'Handles the final order placement logic including auth and chat saving',
    parameters: PlaceFinalOrderSchema,
    generate: async function ({
      content
    }: z.infer<typeof PlaceFinalOrderSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.PLACE_FINAL_ORDER,
          result: {
            message: content
          }
        }
      ] as ToolContent)
      return (
        <BotMessage key={messageId} content={content}>
          <UserDetailsForm messageId={messageId} />
        </BotMessage>
      )
    }
  }
}

export function showUserDetails(history: any, messageId: string) {
  return {
    description: "Shows the user's order details",
    parameters: ShowUserDetailsSchema,
    generate: async function ({
      content
    }: z.infer<typeof ShowUserDetailsSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.SHOW_USER_DETAILS,
          result: {
            message: content
          }
        }
      ] as ToolContent)
      return <BotMessage key={messageId} content={content} />
    }
  }
}

export const getToolFunctions = (history: any, messageId: string) => {
  return {
    renderButtons: renderButtonsTool(history, messageId),
    renderColorPicker: renderColorPickerTool(history, messageId),
    renderColorLabelPickerSet: renderColorLabelPickerSet(history, messageId),
    renderRegionManager: renderRegionManager(history, messageId),
    renderTextInputGroup: renderTextInputGroup(history, messageId),
    generateCanopyMockups: generateCanopyMockups(history, messageId),
    placeFinalOrder: placeFinalOrder(history, messageId),
    showUserDetails: showUserDetails(history, messageId)
  }
}
