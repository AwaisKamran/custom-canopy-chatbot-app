import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileUploadPopover from '@/components/file-upload-popover'
import { act } from 'react'

describe('FileUploadPopover Component', () => {
  describe('Rendering', () => {
    test('renders FileUploadPopover without errors', () => {
      const onFileSelect = jest.fn()
      render(<FileUploadPopover onFileSelect={onFileSelect} disabled={false} />)
      expect(screen.getByTestId('attach-file-button')).toBeInTheDocument()
    })
  })

  describe('Popover Interaction', () => {
    test('popover opens and closes correctly', () => {
      const onFileSelect = jest.fn()
      render(<FileUploadPopover onFileSelect={onFileSelect} disabled={false} />)

      const attachButton = screen.getByTestId('attach-file-button')
      act(() => {
        fireEvent.click(attachButton)
      })
      const uploadButton = screen.getByTestId('upload-button')
      expect(uploadButton).toBeInTheDocument()
      act(() => {
        fireEvent.click(attachButton)
      })
      expect(uploadButton).not.toBeInTheDocument()
    })
  })

  describe('File Upload', () => {
    test('files can be selected and processed', async () => {
      const onFileSelect = jest.fn()
      render(<FileUploadPopover onFileSelect={onFileSelect} disabled={false} />)

      const triggerButton = screen.getByTestId('attach-file-button')
      fireEvent.click(triggerButton)

      const fileInput = screen.getByTestId('upload-button')
      act(() => {
        fireEvent.click(fileInput)
      })
      const file = new File(['file content'], 'test.png', { type: 'image/png' })
      const fileInputElement = screen.getByTestId('file-input')
      fireEvent.change(fileInputElement, { target: { files: [file] } })

      await waitFor(() => {
        expect(onFileSelect).toHaveBeenCalledWith([
          {
            file,
            previewUrl: expect.any(String),
            fileType: 'image/png'
          }
        ])
      })
    })
  })
})
