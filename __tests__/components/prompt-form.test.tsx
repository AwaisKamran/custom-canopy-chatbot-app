import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils/render'
import { PromptForm } from '@/components/prompt-form'
import { mockInitialState } from '@/__mocks__/store'
import { preloadImageMockups, preloadPickerState } from '@/__mocks__/data/chat'
import { streamThread } from '@/lib/redux/apis/chat'
import { generateMockUser } from '@/__mocks__/data/user'

jest.mock('@/lib/hooks/use-enter-submit', () => ({
  useEnterSubmit: () => ({
    formRef: { current: null },
    onKeyDown: jest.fn()
  })
}))

jest.mock('@/lib/hooks/use-stream-processor', () => ({
  useStreamEvents: () => ({
    processStream: jest.fn(),
    isStreaming: false
  })
}))

jest.mock('@/app/actions')
jest.mock('@/lib/redux/apis/chat', () => ({
  createThreadApi: jest.fn().mockResolvedValue({
    id: 'thread-id',
    object: 'thread',
    created_at: 1677649457,
    metadata: {}
  }),
  streamThread: jest.fn()
}))

describe('PromptForm Component Tests', () => {
  const mockSetIsCarouselOpen = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderPromptForm = (preloadedState: any = mockInitialState) => {
    return renderWithProviders(
      <PromptForm
        session={{ user: generateMockUser() }}
        setIsCarouselOpen={mockSetIsCarouselOpen}
      />,
      preloadedState
    )
  }

  describe('Rendering', () => {
    it('renders default state correctly', () => {
      const { getByTestId } = renderPromptForm()

      expect(getByTestId('prompt-message-input')).toBeInTheDocument()
      expect(getByTestId('send-message-button')).toBeEnabled()
    })

    it('renders loading state correctly', () => {
      const { getByTestId } = renderPromptForm({
        preloadedState: {
          ...mockInitialState,
          chatReducer: {
            ...mockInitialState.chatReducer,
            loading: true
          }
        }
      })

      expect(getByTestId('prompt-message-input')).toBeDisabled()
      expect(getByTestId('send-message-button')).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('handles text input correctly', async () => {
      const user = userEvent.setup()
      const { getByTestId } = renderPromptForm()

      const input = getByTestId('prompt-message-input')
      await user.type(input, 'Test message')

      expect(input).toHaveValue('Test message')
    })

    it('submits form and clears input', async () => {
      const user = userEvent.setup()
      const { store, getByTestId } = renderPromptForm()
      const input = getByTestId('prompt-message-input')
      await user.type(input, 'Test message')
      await user.click(getByTestId('send-message-button'))
      await waitFor(() => {
        expect(input).toHaveValue('')
      })

      const actions = store.getState().chatReducer.messages
      expect(actions).toHaveLength(2)
    })
  })

  describe('File Upload', () => {
    it('handles file upload state correctly', async () => {
      const { getByTestId } = renderPromptForm(
        preloadPickerState(mockInitialState, true)
      )

      expect(getByTestId('prompt-message-input')).toBeDisabled()
    })
  })

  describe('Color Picker', () => {
    it('shows color picker when awaiting color selection', () => {
      const { getByTestId } = renderPromptForm(
        preloadPickerState(mockInitialState)
      )

      expect(getByTestId('color-picker-button')).toBeInTheDocument()
    })
  })

  describe('Mockup Viewer', () => {
    it('shows mockup viewer button when mockups exist', () => {
      const { getByTestId } = renderPromptForm(
        preloadImageMockups(mockInitialState)
      )

      expect(getByTestId('view-mockups-button')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('saves chat after successful message submission', async () => {
      const user = userEvent.setup()
      const { getByTestId } = renderPromptForm()

      const input = getByTestId('prompt-message-input')
      await user.type(input, 'Test message')
      await user.click(getByTestId('send-message-button'))

      await waitFor(() => {
        expect(streamThread).toHaveBeenCalled()
      })
    })
  })
})
