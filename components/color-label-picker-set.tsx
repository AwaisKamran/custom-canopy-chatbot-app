'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import ColorPickerWithLabel from './color-picker-with-label'
import { Color } from '@/lib/types'

interface ColorLabelPickerSetProps {
  fieldColors: {
    name: string
    label: string
    color: Color
  }[]
  messageId?: string
  setFieldColors?: (sides: any) => void
}

export const ColorLabelPickerSet = ({
  fieldColors,
  messageId,
  setFieldColors
}: ColorLabelPickerSetProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [fields, setFields] = useState(fieldColors || [])
  const handleColorPickerSelect = (fieldName: string, colorObj: Color) => {
    const updatedFields = fields.map(field =>
      field.label === fieldName ? { ...field, color: colorObj } : field
    )
    setFields(updatedFields)
    setFieldColors?.(updatedFields)
  }
  const onSubmit = async () => {
    const userMessage = JSON.stringify(
      fields.map(field => ({
        [field.name]: {
          [field.label]: {
            color: field.color
          }
        }
      }))
    )
    const message = await submitUserMessage(userMessage)
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <ColorPickerWithLabel
          key={field.label + index}
          label={field.label}
          currentColor={field.color}
          disabled={
            messageId !== messages.at(-1)?.id ||
            fields.some(field => field.color.hex === '')
          }
          onColorSelect={(color: Color) =>
            handleColorPickerSelect(field.label, color)
          }
        />
      ))}
      {!setFieldColors && (
        <button
          className="chat-button"
          onClick={onSubmit}
          disabled={
            messageId !== messages.at(-1)?.id ||
            fields.some(field => field.color.hex === '')
          }
        >
          Okay
        </button>
      )}
    </div>
  )
}
