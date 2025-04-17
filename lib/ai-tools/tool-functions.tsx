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
  ShowUserDetailsSchema,
  ShowGeneratedMockupsToolSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorSwatcherWrapper } from '@/components/chat-color-swatcher-wrapper'
import {
  generateTentMockupsApi,
  pollMockupGeneration
} from '../redux/apis/tent-mockup-prompt'
import { MockupResponse, Roles, Session, TentMockUpPrompt } from '../types'
import { TOOL_FUNCTIONS } from './constants'
import { modifyAIState } from './utils'
import { ChatTextInputGroup } from '@/components/chat-text-input-group'
import ChatActionMultiSelector from '@/components/chat-action-multi-selector'
import RegionsColorsManager from '@/components/regions_colors_manager'
import { ColorLabelPickerSet } from '@/components/color-label-picker-set'
import { UserDetailsForm } from '@/components/user-details-form'
import { auth } from '@/auth'

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
    description:
      'Starts backend mockup generation and shows user form while waiting',
    parameters: CustomCanopyToolSchema,
    generate: async function ({
      content,
      payload
    }: z.infer<typeof CustomCanopyToolSchema>) {
      const { mockupRequestId } = await generateTentMockupsApi({
        ...(payload as TentMockUpPrompt),
        id: history.get().id
      })
      const session = (await auth()) as Session
      const inputFields = [
        {
          label: 'Email',
          value: session?.user?.email || '',
          disabled: !!session?.user?.email,
          type: 'email'
        },
        {
          label: 'Phone Number',
          value: session?.user?.phoneNumber ?? '',
          type: 'tel',
          disabled: !!session?.user?.phoneNumber
        }
      ]

      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
          result: {
            message: content,
            props: { payload }
          }
        }
      ] as ToolContent)

      return (
        <BotMessage content={content}>
          <UserDetailsForm
            messageId={messageId}
            userFields={inputFields}
            mockupRequestId={mockupRequestId}
          />
        </BotMessage>
      )
    }
  }
}

export function showGeneratedMockups(history: any, messageId: string) {
  return {
    description: 'Displays mockups after user details are submitted',
    parameters: ShowGeneratedMockupsToolSchema,
    generate: async function ({
      content,
      mockupRequestId,
      options,
      selectorName
    }: z.infer<typeof ShowGeneratedMockupsToolSchema>) {
      const chatID = history.get().id
      const outputDir = `chat:${chatID}`
      const mockups: MockupResponse = await pollMockupGeneration(
        mockupRequestId,
        outputDir
      )

      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.SHOW_GENERATED_MOCKUPS,
          result: {
            message: content,
            props: {
              options,
              selectorName,
              mockups,
              action: 'Place Order'
            }
          }
        }
      ] as ToolContent)

      return (
        <BotMessage content={content}>
          <Carousal mockups={mockups} open={true} />
          <ChatActionMultiSelector
            action="Place Order"
            selectorName={selectorName}
            options={options}
            messageId={messageId}
          />
        </BotMessage>
      )
    }
  }
}

export function placeFinalOrder(history: any, messageId: string) {
  return {
    description: "Place the user's final order.",
    parameters: ShowUserDetailsSchema,
    generate: async function ({
      content
    }: z.infer<typeof ShowUserDetailsSchema>) {
      modifyToolAIState(history, [
        {
          toolCallId: messageId,
          toolName: TOOL_FUNCTIONS.PLACE_FINAL_ORDER,
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
    showGeneratedMockups: showGeneratedMockups(history, messageId)
  }
}
