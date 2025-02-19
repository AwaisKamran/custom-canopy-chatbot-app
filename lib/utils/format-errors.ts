import { ZodError } from 'zod'
import { ActionErrors, FieldErrors } from '../types'
import { AuthError } from 'next-auth'

export function formatError(error: unknown): ActionErrors {
  if (error instanceof ZodError) {
    return formatZodError(error)
  }

  if (error instanceof AuthError) {
    const e = error as AuthError
    return {
      formErrors: [e.cause?.err?.message || e.message]
    }
  }

  if (error instanceof Error) {
    const e = error as Error
    return {
      formErrors: [e.message]
    }
  }

  if (typeof error === 'string') {
    return {
      formErrors: [error]
    }
  }

  return {
    formErrors: ['An error occurred']
  }
}

function formatZodError(error: ZodError): ActionErrors {
  const zodErrors = error.flatten()
  const errors: ActionErrors = {
    formErrors: zodErrors?.formErrors
  }

  if (zodErrors?.fieldErrors) {
    const fieldErrors: FieldErrors = {}

    for (const key in zodErrors.fieldErrors) {
      fieldErrors[key] = zodErrors.fieldErrors[key]?.join(', ')
    }
    errors.fieldErrors = fieldErrors
  }
  return errors
}
