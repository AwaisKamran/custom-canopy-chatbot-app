'use server'

import { signIn } from '@/auth'
import { getStringFromBuffer } from '@/lib/utils'
import { kv } from '@vercel/kv'
import { getUser } from '../login/actions'
import { AuthError } from 'next-auth'
import { ErrorMessage, SuccessMessage } from '../constants'
import { SignupSchema } from '@/lib/schemas/signupSchema'
import { ActionResult, ResultCode } from '@/lib/types'
import { formatError } from '@/lib/utils/format-errors'

export async function createUser(
  email: string,
  hashedPassword: string,
  username: string,
  phoneNumber: string,
  salt: string
) {
  const existingUser = await getUser(email)

  if (existingUser) {
    return {
      type: ErrorMessage.message,
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      username,
      phoneNumber,
      salt
    }

    await kv.hmset(`user:${email}`, user)

    return {
      type: SuccessMessage.message,
      resultCode: ResultCode.UserCreated
    }
  }
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const phoneNumber = formData.get('phoneNumber') as string

  const parsedCredentials = SignupSchema.safeParse({
    email,
    password,
    username,
    phoneNumber
  })

  if (parsedCredentials.success) {
    const salt = crypto.randomUUID()

    const encoder = new TextEncoder()
    const saltedPassword = encoder.encode(password + salt)
    const hashedPasswordBuffer = await crypto.subtle.digest(
      'SHA-256',
      saltedPassword
    )
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

    try {
      const result = await createUser(
        email,
        hashedPassword,
        username,
        phoneNumber,
        salt
      )

      if (result.resultCode === ResultCode.UserCreated) {
        await signIn('credentials', {
          email,
          password,
          redirect: false
        })
      }

      return result
    } catch (error) {
      const formattedErrors = formatError(error)
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              type: ErrorMessage.message,
              resultCode: ResultCode.InvalidCredentials,
              errors: formattedErrors
            }
          default:
            return {
              type: ErrorMessage.message,
              resultCode: ResultCode.UnknownError,
              errors: formattedErrors
            }
        }
      } else {
        return {
          type: ErrorMessage.message,
          resultCode: ResultCode.UnknownError,
          errors: formattedErrors
        }
      }
    }
  } else {
    return {
      type: ErrorMessage.message,
      resultCode: ResultCode.InvalidCredentials,
      errors: formatError(parsedCredentials.error)
    }
  }
}
