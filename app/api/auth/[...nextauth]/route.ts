import { getUser } from '@/app/login/actions'
import { authConfig } from '@/auth.config'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

export const {
  handlers: { GET, POST }
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email()
          })
          .safeParse(credentials)

        if (
          parsedCredentials &&
          parsedCredentials.success &&
          parsedCredentials.data
        ) {
          const { email } = parsedCredentials.data
          const user = await getUser(email)

          if (user) return user
        }

        return null
      }
    })
  ]
})
