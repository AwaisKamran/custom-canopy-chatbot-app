'use client'

import { authenticateOrSignup } from '@/app/login/actions'
import { useRouter } from 'next/navigation'
import { saveChat } from '@/app/actions'
import { useAIState, useUIState } from 'ai/rsc'

export interface UserDetailsFormProps {
  messageId: string
}

export function UserDetailsForm({ messageId }: UserDetailsFormProps) {
  const router = useRouter()
  const [messages, _setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await authenticateOrSignup(undefined, formData)
    if (result?.type === 'success') {
      await saveChat(aiState)
      router.refresh()
    } else {
      console.error(result?.resultCode)
    }
  }

  return (
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
  )
}
