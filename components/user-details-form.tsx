'use client'

import { authenticateOrSignup } from '@/app/login/actions'
import { useRouter } from 'next/navigation'
import { useAIState, useUIState, useActions } from 'ai/rsc'
import { toast } from 'sonner'
import { getMessageFromCode } from '@/lib/utils'
import { saveChat } from '@/app/actions'

export interface UserDetailsFormProps {
  messageId: string
  action: string
  email?: string
  phoneNumber?: string
  disabled: boolean
}

export function UserDetailsForm({
  messageId,
  action,
  email,
  phoneNumber,
  disabled
}: UserDetailsFormProps) {
  const router = useRouter()
  const [messages, _setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()
  const { submitUserMessage } = useActions()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await authenticateOrSignup(undefined, formData)
    if (result?.type === 'success') {
      const jsonResult = Object.fromEntries(formData.entries())
      await submitUserMessage(JSON.stringify(jsonResult))
      _setMessages((currentMessages: any) => currentMessages.slice(0, -1))
      await saveChat(aiState)
      toast.success(getMessageFromCode(result.resultCode))
      router.refresh()
    } else {
      console.error(result?.resultCode)
      const error = result?.resultCode
        ? getMessageFromCode(result.resultCode)
        : 'An unexpected error occurred, please try again later!'
      toast.error(error)
    }
  }

  return (
    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 -mt-4 mx-2">
      {disabled ? (
        <div>
          <div>Your order has been placed with the following details:</div>
          <ul className="space-y-2">
            <li>Email: {email}</li>
            <li>Phone number: {phoneNumber}</li>
          </ul>
          <div>Thank you for choosing Custom Canopy!</div>
        </div>
      ) : (
        <form
          aria-disabled={messageId !== messages.at(-1)?.id || aiState.loading}
          className="space-y-4 px-1"
          onSubmit={handleSubmit}
        >
          <div>Please provide the following information:</div>
          <div>
            <label
              className="mb-3 block text-xs font-medium text-zinc-400"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={messageId !== messages.at(-1)?.id || aiState.loading}
            className="my-4 h-10 w-full rounded-md bg-action-button p-2 text-sm font-semibold"
          >
            {action}
          </button>
        </form>
      )}
    </div>
  )
}
