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
  ShowUserDetailsSchema
} from './schemas'
import { Carousal } from '@/components/carousel'
import { BotCard, BotMessage } from '@/components/stocks/message'
import { ChatRadioButtonWrapper } from '@/components/chat-radio-buttons-wrapper'
import { ChatColorSwatcherWrapper } from '@/components/chat-color-swatcher-wrapper'
import { generateTentMockupsApi } from '../redux/apis/tent-mockup-prompt'
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

async function showMockupsMessage(
  content: string,
  options: {
    name: string
    value: string
    selected: boolean
    edit: boolean
  }[],
  selectorName: string,
  messageId: string,
  mockups: MockupResponse,
  history: any
) {
  modifyToolAIState(history, [
    {
      toolCallId: messageId,
      toolName: TOOL_FUNCTIONS.GENERATE_CANOPY_MOCKUPS,
      result: {
        message: content,
        props: {
          options,
          selectorName,
          mockups,
          action: 'Have a Design Specialist. Contact Me.'
        }
      }
    }
  ] as ToolContent)

  return (
    <BotMessage content={content}>
      <Carousal mockups={mockups} open={true} />
      <ChatActionMultiSelector
        action="Have a Design Specialist. Contact Me."
        selectorName={selectorName}
        options={options}
        messageId={messageId}
      />
    </BotMessage>
  )
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
    generate: async function* ({
      content,
      payload,
      selectorName,
      options
    }: z.infer<typeof CustomCanopyToolSchema>) {
      const session = (await auth()) as Session

      yield (
        <BotCard key={messageId}>
          <div className="flex gap-2">{`${content} Please wait...`}</div>
        </BotCard>
      )

      if (session?.user) {
        const mockups = await generateTentMockupsApi({
          ...(payload as TentMockUpPrompt),
          id: history.get().id
        })
        return showMockupsMessage(
          'Your mockups are ready! Thank you for your patience.',
          options,
          selectorName,
          messageId,
          mockups,
          history
        )
      }

      const inputFields = [
        {
          label: 'Email',
          name: 'email',
          value: '',
          type: 'email',
          placeholder: 'example@gmail.com'
        },
        {
          label: 'Phone No.',
          name: 'phoneNumber',
          value: '',
          type: 'tel',
          placeholder: '+1 (555) 555-1234'
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
        <BotMessage
          content={`${content} Please provide your email and phone number to continue.`}
        >
          <UserDetailsForm messageId={messageId} userFields={inputFields} />
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
    placeFinalOrder: placeFinalOrder(history, messageId)
  }
}
