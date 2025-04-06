'use server'

import { signIn } from '@/auth'
import { ResultCode, User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { ErrorMessage, SuccessMessage } from '../constants'

export async function getUser(email: string) {
  const user = await kv.hgetall<User>(`user:${email}`)
  return user
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email')

    const parsedCredentials = z
      .object({
        email: z.string().email()
      })
      .safeParse({
        email
      })

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        redirect: false
      })

      return {
        type: SuccessMessage.message,
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: ErrorMessage.message,
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: ErrorMessage.message,
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: ErrorMessage.message,
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}
