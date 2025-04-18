'use client'

import { authenticateOrSignup } from '@/app/login/actions'
import { useAIState, useUIState, useActions } from 'ai/rsc'
import { toast } from 'sonner'
import { getMessageFromCode } from '@/lib/utils'
import { useState } from 'react'
import TextInputWithLabel from './ui/text-input-with-label'
import { useSession } from 'next-auth/react'
import { ClientMessage } from '@/lib/types'
import _ from 'lodash'
import { useRouter } from 'next/navigation'

export interface UserDetailsFormProps {
  messageId: string
  userFields: {
    label: string
    value: string
    name: string
    type: string
    placeholder: string
  }[]
}

export function UserDetailsForm({
  messageId,
  userFields
}: Readonly<UserDetailsFormProps>) {
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()
  const { submitUserMessage } = useActions()
  const { data, update } = useSession()
  const [fields, setFields] = useState(userFields)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    if (data) {
      const message = await submitUserMessage(
        JSON.stringify({
          userFields: fields
        }),
        true
      )
      setMessages((currentMessages: ClientMessage[]) => [
        ...currentMessages,
        message
      ])
      return
    }
    fields.forEach(field => {
      formData.append(field.name, field.value)
    })
    const result = await authenticateOrSignup(undefined, formData)
    if (result?.type === 'success') {
      await update()

      const message = await submitUserMessage(
        JSON.stringify({
          inputFields: fields
        }),
        true
      )
      setMessages((currentMessages: ClientMessage[]) => [
        ...currentMessages,
        message
      ])
      router.refresh()
      toast.success(getMessageFromCode(result?.resultCode ?? ''))
    } else {
      const error = result?.resultCode
        ? getMessageFromCode(result.resultCode)
        : 'An unexpected error occurred, please try again later!'
      toast.error(error)
    }
  }

  const handleChange = (index: number, newValue: string) => {
    const updatedFields = fields.map((field: any, i: number) =>
      i === index ? { ...field, value: newValue } : field
    )
    setFields(updatedFields)
  }

  return (
    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
      <form className="space-y-4 px-1" onSubmit={handleSubmit}>
        {fields?.map((field, index) => (
          <TextInputWithLabel
            key={`${field.label}-${index}`}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={(value: any) => handleChange(index, value)}
            disabled={messageId !== messages.at(-1)?.id}
            placeholder={field.placeholder}
            required
          />
        ))}
        <button
          type="submit"
          disabled={messageId !== messages.at(-1)?.id || aiState.loading}
          className="my-4 h-10 w-full rounded-md bg-action-button p-2 text-sm font-semibold"
        >
          Submit Details
        </button>
      </form>
    </div>
  )
}
