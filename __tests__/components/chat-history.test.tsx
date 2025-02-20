import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChatHistory } from '@/components/chat-history'
import { generateMockUser } from '@/__mocks__/data/user'

jest.mock('@/components/sidebar-list', () => ({
  SidebarList: jest.fn(() => <div data-testid="sidebar-list" />)
}))

jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest.fn(() => 'button-variant-classes')
}))

jest.mock('@/components/ui/icons', () => ({
  IconPlus: jest.fn(() => <span data-testid="icon-plus" />)
}))

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => classes.join(' '))
}))

describe('ChatHistory Component', () => {
  it('renders with a user ID', async () => {
    const mockSession = generateMockUser()
    render(await ChatHistory({ userId: mockSession.id }))
    expect(screen.getByTestId('chat-history-title')).toBeInTheDocument()
    const newChatButton = screen.getByTestId('new-chat-button')
    expect(newChatButton).toBeInTheDocument()
  })
})
