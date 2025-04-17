'use client'

import { useAIState, useUIState, useActions } from 'ai/rsc'

export interface UserDetailsFormProps {
  messageId: string
  mockupRequestId: string
}

export function UserDetailsForm({
  messageId,
  mockupRequestId
}: UserDetailsFormProps) {
  const [messages, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()
  const { submitUserMessage } = useActions()

  const submitResponse = async (message: string) => {
    const response = await submitUserMessage(message)
    setMessages((currentMessages: any) => [...currentMessages, response])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const jsonResult = Object.fromEntries(formData.entries())
    await submitResponse(
      JSON.stringify({
        ...jsonResult,
        mockupRequestId: mockupRequestId
      })
    )
  }

  return (
    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
      <form
        aria-disabled={messageId !== messages.at(-1)?.id || aiState.loading}
        className="space-y-4 px-1"
        onSubmit={handleSubmit}
      >
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
          Submit Details
        </button>
      </form>
    </div>
  )
}
