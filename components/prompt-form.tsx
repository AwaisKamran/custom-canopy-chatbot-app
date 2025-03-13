'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { FileData, Roles, Session } from '@/lib/types'
import FileUploadPopover from './file-upload-popover'
import FilePreview from './file-preview'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { nanoid } from '@/lib/utils'
import { saveFilesApi } from '@/lib/redux/apis/chat'
import { ImagePart, UserContent } from 'ai'
import { isLastFileUploadMessage } from '@/lib/ai-tools/utils'
import { IMAGE } from '@/app/constants'

export function PromptForm({ session }: { session?: Session }) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const [input, setInput] = React.useState<string>('')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [selectedFiles, setSelectedFiles] = React.useState<FileData[]>([])
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()
  const [aiState, _setAIState] = useAIState()
  const lastMessage = aiState?.messages?.at(-1)
  const lastFileUploadMessage = isLastFileUploadMessage(lastMessage)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleFileSelect = (files: FileData[]) => {
    const newFiles: FileData[] = files.map(fileData => {
      return {
        file: fileData.file,
        name: fileData.file.name,
        previewUrl: fileData.previewUrl,
        fileType: fileData.fileType
      }
    })
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles: FileData[]) =>
      prevFiles.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (window.innerWidth < 600) {
      ;(e.target as HTMLFormElement)['message']?.blur()
    }

    let value: UserContent = input.trim()
    setInput('')
    const messageId = nanoid()
    if (selectedFiles.length) {
      const files = await saveFilesApi(
        selectedFiles,
        aiState.id,
        messageId,
        session?.user?.id || ''
      )
      value = [
        {
          type: IMAGE,
          image: new URL(files[0].url),
          mimeType: files[0].contentType
        } as ImagePart
      ]
      setSelectedFiles([])
    }
    setMessages((currentConversation: any) => [
      ...currentConversation,
      {
        id: messageId,
        role: Roles.user,
        display: <UserMessage content={value} />
      }
    ])
    const assistantResponse = await submitUserMessage(value)
    setMessages((currentConversation: any) => [
      ...currentConversation,
      assistantResponse
    ])
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:px-4">
        <div className="flex flex-wrap gap-4 mb-2">
          {selectedFiles.map((fileData, index) => (
            <FilePreview
              key={index}
              file={fileData.file}
              previewUrl={fileData.previewUrl}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
        </div>
        <div className="flex space-between items-center mt-auto">
          <div className="left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4">
            <FileUploadPopover
              onFileSelect={handleFileSelect}
              disabled={!lastFileUploadMessage}
            />
          </div>
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Send a message."
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="right-0 top-[13px] sm:right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    aiState.loading ||
                    (lastFileUploadMessage && selectedFiles.length === 0)
                  }
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </form>
  )
}
