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
}

export const ColorLabelPickerSet = ({
  fieldColors,
  messageId
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
      <button
        className="py-2 px-4 mb-2 rounded-md dark:text-white flex-auto whitespace-nowrap disabled:cursor-not-allowed border border-neutral-400 bg-slate-400 text-white dark:bg-cyan-800 disabled:opacity-50 disabled:pointer-events-none"
        onClick={onSubmit}
        disabled={
          messageId !== messages.at(-1)?.id ||
          fields.some(field => field.color.value === '')
        }
      >
        Okay
      </button>
    </div>
  )
}
