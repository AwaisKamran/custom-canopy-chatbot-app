import { PHONE_REGEX } from '@/app/constants'
import { z } from 'zod'

export const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, { message: 'Invalid phone number format' })
})

export type SignupData = z.infer<typeof SignupSchema>
