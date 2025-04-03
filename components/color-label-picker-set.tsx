'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import ColorPickerWithLabel from './color-picker-with-label'

interface ColorLabelPickerSetProps {
  fieldColors: {
    name: string
    label: string
    color: { name: string; value: string }
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
  const handleColorPickerSelect = (
    fieldName: string,
    colorObj: {
      name: string
      value: string
    }
  ) => {
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
            color: { color: field.color.value, colorName: field.color.name }
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
            fields.some(field => field.color.value === '')
          }
          onColorSelect={handleColorPickerSelect}
        />
      ))}
      {!setFieldColors && (
        <button
          className="chat-button"
          onClick={onSubmit}
          disabled={
            messageId !== messages.at(-1)?.id ||
            fields.some(field => field.color.value === '')
          }
        >
          Okay
        </button>
      )}
    </div>
  )
}
