'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import TextInputWithLabel from './ui/text-input-with-label'

interface ChatTextInputGroupProps {
  inputFields: { label: string; value: string }[]
  messageId?: string
}

export const ChatTextInputGroup = ({
  inputFields,
  messageId
}: ChatTextInputGroupProps) => {
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState()
  const [fields, setFields] = useState(inputFields || [])

  const handleChange = (index: number, newValue: string) => {
    const updatedFields = fields.map((field, i) =>
      i === index
        ? { ...field, value: newValue || inputFields[i].value }
        : field
    )
    setFields(updatedFields)
  }

  const onSubmit = async () => {
    const userMessage = JSON.stringify(
      fields.map(field => ({
        [field.label]: field.value
      }))
    )
    const message = await submitUserMessage(userMessage)
    setMessages((currentMessages: any) => [...currentMessages, message])
  }

  return (
    <div className="flex flex-col gap-2">
      {fields?.map((option, index) => (
        <TextInputWithLabel
          key={`${option.label}-${index}`}
          label={option.label}
          value={option.value}
          onChange={value => handleChange(index, value)}
          disabled={messageId !== messages.at(-1)?.id}
        />
      ))}
      <button
        className="py-2 px-4 mb-2 rounded-md dark:text-white flex-auto whitespace-nowrap disabled:cursor-not-allowed border border-neutral-400 bg-slate-400 text-white dark:bg-cyan-800 disabled:opacity-50 disabled:pointer-events-none"
        onClick={onSubmit}
        disabled={
          messageId !== messages.at(-1)?.id ||
          fields.some(field => field.value === '')
        }
      >
        Okay
      </button>
    </div>
  )
}
