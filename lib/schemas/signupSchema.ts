import { PHONE_REGEX } from '@/app/constants'
import { z } from 'zod'

export const SignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be less than 20 characters long' }),
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, { message: 'Invalid phone number format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
})

export type SignupData = z.infer<typeof SignupSchema>
