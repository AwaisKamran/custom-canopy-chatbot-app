import { render, waitFor } from '@testing-library/react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SignupPage from '@/app/signup/page'
import { generateMockUser } from '@/__mocks__/data/user'

jest.mock('@/auth', () => ({
  auth: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn()
  })),
  redirect: jest.fn()
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(() => [undefined, jest.fn()]),
  useFormStatus: jest.fn(() => ({ pending: false }))
}))

describe('Signup Page', () => {
  it('should redirect to home if session exists', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: generateMockUser() })

    await SignupPage()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should render the login page if no session exists', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const { getByText } = render(await SignupPage())

    await waitFor(() => {
      expect(getByText('Sign up for an account!')).toBeInTheDocument()
    })
  })
})
