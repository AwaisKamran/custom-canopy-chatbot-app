// __tests__/app/chat/chat/[id]/page.test.tsx
import { waitFor } from '@testing-library/react'
import { auth } from '@/auth'
import { getMissingKeys } from '@/app/actions'
import { redirect } from 'next/navigation'
import { renderWithProviders } from '@/__tests__/utils/render'
import ChatPage from '@/app/(chat)/chat/[id]/page'
import { mockIntersectionObserver, mockScrollIntoView } from '@/__mocks__'
import { generateMockUser } from '@/__mocks__/data/user'

jest.mock('@/auth', () => ({
  auth: jest.fn()
}))

jest.mock('@/app/actions', () => ({
  getMissingKeys: jest.fn(),
  getChat: jest.fn().mockResolvedValue({
    id: 'chat1',
    userId: '123',
    message: [{ id: '1', message: 'Hello', role: 'user' }]
  })
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/chat'),
  redirect: jest.fn(),
  notFound: jest.fn()
}))

window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
window.IntersectionObserver = mockIntersectionObserver

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to login if no session exists', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)
    renderWithProviders(await ChatPage({ params: { id: 'chat1' } }))
    expect(redirect).toHaveBeenCalledWith('/login?next=/chat/chat1')
  })

  it('should render the Chat component with session and no missing keys', async () => {
    const mockMissingKeys = ['key1', 'key2']
    const mockSession = generateMockUser()
    ;(auth as jest.Mock).mockResolvedValue({ user: mockSession })
    ;(getMissingKeys as jest.Mock).mockResolvedValue(mockMissingKeys)

    const { getByTestId } = renderWithProviders(
      await ChatPage({ params: { id: 'chat1' } })
    )

    await waitFor(() => {
      expect(getByTestId('prompt-message-input')).toBeInTheDocument()
    })
  })
})
