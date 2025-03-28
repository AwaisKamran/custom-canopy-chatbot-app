import { authenticate, getUser } from '@/app/login/actions'
import { signup } from '@/app/signup/actions'

export async function loginOrCreateUser(email: string, phoneNumber: string) {
  let user = await getUser(email)

  if (!user) {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('phoneNumber', phoneNumber)

    await signup(undefined, formData)
  } else {
    const formData = new FormData()
    formData.append('email', email)
    await authenticate(undefined, formData)
  }
  return await getUser(email)
}
