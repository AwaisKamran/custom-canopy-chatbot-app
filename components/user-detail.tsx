'use client'

import { useFormStatus } from 'react-dom'
import { IconSpinner } from './ui/icons'
import { authenticateAndSaveChat } from '@/lib/utils/authentication'
import { usePathname } from 'next/navigation'

export function UserDetails() {
  const path = usePathname()
  const chatId = path.split('/chat/')[1]
  return (
    <form action={authenticateAndSaveChat} className="px-2 gap-4 text-sm">
      <input hidden id="chatId" type="text" name="chatId" value={chatId} />
      <div className="w-full rounded-lg shadow-md">
        <div>
          <label className="mb-3 block text-foreground" htmlFor="email">
            Email
          </label>
          <div>
            <input
              className="w-full rounded-md px-2 py-[9px] text-sm outline-none placeholder:text-foreground"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-foreground"
            htmlFor="phone-number"
          >
            Phone Number
          </label>
          <div>
            <input
              className="w-full rounded-md px-2 py-[9px] text-sm outline-none placeholder:text-foreground"
              id="phone-number"
              type="phone-number"
              name="phone-number"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
      </div>
      <button className="my-4 h-10 w-full rounded-md bg-tab-button p-2 text-sm font-semibold">
        Submit
      </button>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="my-4 h-10 w-full rounded-md bg-tab-button p-2 text-sm font-semibold"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Submit'}
    </button>
  )
}
