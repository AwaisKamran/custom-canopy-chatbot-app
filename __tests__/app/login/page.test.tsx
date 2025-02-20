import { render, waitFor } from '@testing-library/react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LoginPage from '@/app/login/page'
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

describe('LoginPage', () => {
  it('should redirect to home if session exists', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: generateMockUser() })

    await LoginPage()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should render the login page if no session exists', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const { getByText } = render(await LoginPage())

    await waitFor(() => {
      expect(getByText('Please log in to continue.')).toBeInTheDocument()
    })
  })
})
