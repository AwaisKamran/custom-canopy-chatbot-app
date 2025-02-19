'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/signup/actions'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { InputField } from './ui/inputField'

export default function SignupForm() {
  const router = useRouter()
  const [result, dispatch] = useFormState(signup, undefined)

  useEffect(() => {
    if (result) {
      if (result.errors?.formErrors) {
        result.errors?.formErrors?.forEach((error: string) =>
          toast.error(error)
        )
      } else {
        toast.success(getMessageFromCode(result.resultCode))
        router.refresh()
      }
    }
  }, [result, router])

  return (
    <form
      action={dispatch}
      className="flex flex-col items-center gap-4 space-y-3"
    >
      <div className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md md:w-96 dark:bg-zinc-950">
        <img
          src="/custom-canopy-logo.png"
          alt="logo"
          className="invert dark:invert-0 mx-auto h-21 w-auto mb-5"
        />
        <h1 className="mb-3 text-2xl font-bold">Sign up for an account!</h1>
        <div className="w-full">
          <InputField
            label="Username"
            id="username"
            name="username"
            placeholder="Enter your username"
            error={result?.errors?.fieldErrors?.username}
            type="text"
            required
          />
          <InputField
            label="Email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            error={result?.errors?.fieldErrors?.email}
            type="email"
            containerClassName="mt-2"
            required
          />
          <InputField
            label="Phone"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number (+1234567890)"
            error={result?.errors?.fieldErrors?.phoneNumber}
            type="text"
            containerClassName="mt-2"
            required
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            placeholder="Enter password"
            error={result?.errors?.fieldErrors?.password}
            type="password"
            containerClassName="mt-2"
            minLength={6}
            required
          />
        </div>
        <LoginButton />
      </div>

      <Link href="/login" className="flex flex-row gap-1 text-sm text-zinc-400">
        Already have an account?
        <div className="font-semibold underline">Log in</div>
      </Link>
    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Create account'}
    </button>
  )
}
