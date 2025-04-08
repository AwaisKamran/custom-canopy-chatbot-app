import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { getUser } from './app/login/actions'

export const { auth, signIn, signOut } = NextAuth({
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
