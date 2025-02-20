import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { ErrorMessage, SuccessMessage } from '@/app/constants'
import LoginForm from '@/components/login-form'
import {
  mockGetMessage,
  mockRouter,
  mockToastError,
  mockToastSuccess
} from '@/__mocks__'
import { ResultCode } from '@/lib/types'

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(() => [undefined, jest.fn()]),
  useFormStatus: jest.fn(() => ({ pending: false }))
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  cn: jest.fn(() => 'mocked-class-name'),
  getMessageFromCode: jest.fn()
}))

describe('LoginForm', () => {
  const mockDispatch = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    ;(require('next/navigation').useRouter as jest.Mock).mockReturnValue(
      mockRouter
    )
    ;(require('react-dom').useFormState as jest.Mock).mockReturnValue([
      undefined,
      mockDispatch
    ])
  })

  describe('Rendering', () => {
    it('renders the login form with input fields and buttons', () => {
      render(<LoginForm />)

      expect(screen.getByTestId('login-header')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-input')).toBeInTheDocument()
      expect(screen.getByTestId('login-button')).toBeInTheDocument()
    })

    it('renders the signup link', () => {
      render(<LoginForm />)
      const signupLink = screen.getByTestId('signup-link')
      expect(signupLink).toBeInTheDocument()
      expect(signupLink).toHaveAttribute('href', '/signup')
    })
  })

  describe('User Interactions', () => {
    it('accepts email and password input', () => {
      render(<LoginForm />)

      const email = faker.internet.email()
      const password = faker.internet.password()

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')

      fireEvent.change(emailInput, { target: { value: email } })
      fireEvent.change(passwordInput, { target: { value: password } })

      expect(emailInput).toHaveValue(email)
      expect(passwordInput).toHaveValue(password)
    })

    it('disables the login button when pending', () => {
      ;(require('react-dom').useFormStatus as jest.Mock).mockReturnValue({
        pending: true
      })

      render(<LoginForm />)
      const loginButton = screen.getByTestId('login-button')

      expect(loginButton).toBeDisabled()
    })

    it('enables the login button when not pending', () => {
      ;(require('react-dom').useFormStatus as jest.Mock).mockReturnValue({
        pending: false
      })

      render(<LoginForm />)
      const loginButton = screen.getByTestId('login-button')

      expect(loginButton).not.toBeDisabled()
    })
  })

  describe('Result Handling', () => {
    it('shows an error toast if authentication fails', async () => {
      const errorResult = {
        type: ErrorMessage.message,
        resultCode: ResultCode.InvalidCredentials
      }
      ;(require('react-dom').useFormState as jest.Mock).mockReturnValue([
        errorResult,
        jest.fn()
      ])
      mockGetMessage.mockReturnValue('Invalid credentials')

      render(<LoginForm />)

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Invalid credentials')
      })
    })

    it('shows a success toast and redirects if authentication succeeds', async () => {
      const successResult = {
        type: SuccessMessage.message,
        resultCode: ResultCode.UserLoggedIn
      }
      ;(require('react-dom').useFormState as jest.Mock).mockReturnValue([
        successResult,
        jest.fn()
      ])
      mockGetMessage.mockReturnValue('User logged in successfully')

      render(<LoginForm />)

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          'User logged in successfully'
        )
        expect(mockRouter.push).toHaveBeenCalledWith('/')
        expect(mockRouter.refresh).toHaveBeenCalled()
      })
    })
  })

  describe('Integration', () => {
    it('submits the form and dispatches the action', () => {
      const email = faker.internet.email()
      const password = faker.internet.password()

      render(<LoginForm />)

      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const loginButton = screen.getByTestId('login-button')

      fireEvent.change(emailInput, { target: { value: email } })
      fireEvent.change(passwordInput, { target: { value: password } })
      fireEvent.click(loginButton)

      waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })
    })
  })
})
