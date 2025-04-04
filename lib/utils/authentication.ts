import { authenticate, getUser } from '@/app/login/actions'
import { signup } from '@/app/signup/actions'
import { ResultCode } from '../types'
import { redirect } from 'next/navigation'

export async function authenticateOrSignup(formData: FormData) {
  const email = formData.get('email') as string
  const user = await getUser(email)
  let result

  if (user) {
    result = await authenticate(undefined, formData)
  } else {
    result = await signup(undefined, formData)
  }

  return result
}

export async function authenticateAndSaveChat(formData: FormData) {
  const result = await authenticateOrSignup(formData)
  if (
    result?.resultCode === ResultCode.UserLoggedIn ||
    result?.resultCode === ResultCode.UserCreated
  ) {
    const chatId = formData.get('chatId')
    redirect('/chat')
  }
}
