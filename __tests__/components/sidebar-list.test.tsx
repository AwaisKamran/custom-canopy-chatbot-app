import { waitFor, fireEvent } from '@testing-library/react'
import { clearChats, getChats } from '@/app/actions'
import { act } from 'react'
import { SidebarList } from '@/components/sidebar-list'
import { Error401Response } from '@/app/constants'
import { redirect } from 'next/navigation'
import { generateMockChats } from '@/__mocks__/data/chat'
import { renderWithProviders } from '../utils/render'
import { generateMockUser } from '@/__mocks__/data/user'

jest.mock('@/app/actions')
jest.mock('next/navigation')
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: jest.fn(fn => fn)
}))

describe('SidebarList Component', () => {
  const mockSession = generateMockUser()
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with valid userId and chats', async () => {
    const mockChats = generateMockChats(mockSession.id)

    ;(getChats as jest.Mock).mockResolvedValue(mockChats)
    const { getByText } = renderWithProviders(
      await SidebarList({ userId: '123' })
    )
    await waitFor(() => {
      expect(getByText(mockChats[0].title)).toBeInTheDocument()
    })
  })

  it('renders with valid userId and no chats', async () => {
    ;(getChats as jest.Mock).mockResolvedValue([])
    const { getByText } = renderWithProviders(
      await SidebarList({ userId: '123' })
    )

    expect(getByText('No chat history')).toBeInTheDocument()
  })

  it('renders with valid userId and 401 error', async () => {
    ;(getChats as jest.Mock).mockResolvedValue({
      [Error401Response.message]: true
    })

    renderWithProviders(await SidebarList({ userId: mockSession.id }))

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/')
    })
  })

  it('clears chat history', async () => {
    const mockChats = generateMockChats(mockSession.id)
    ;(getChats as jest.Mock).mockResolvedValue(mockChats)

    const { getByText, getByRole } = renderWithProviders(
      await SidebarList({ userId: mockSession.id })
    )

    const clearButton = getByText(/Clear history/i)
    expect(clearButton).toBeInTheDocument()
    act(() => {
      fireEvent.click(clearButton)
    })

    const deleteButton = getByRole('button', { name: /delete/i })

    act(() => {
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      expect(clearChats).toHaveBeenCalled()
    })
  })
})
