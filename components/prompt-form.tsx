'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPicture } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { FileData, Roles, Session, Regions, TentColorConfig } from '@/lib/types'
import { saveChat } from '@/app/actions'
import {
  addChatMessage,
  addMessage,
  createThread,
  saveFiles
} from '@/lib/redux/slice/chat'
import { useDispatch, useSelector } from 'react-redux'
import FileUploadPopover from './file-upload-popover'
import FilePreview from './file-preview'
import ColorPicker from './color-picker'
import {
  generateTentMockups,
  processTentMockups,
  setMockUpPrompt
} from '@/lib/redux/slice/tent-mockup-prompt'
import { AppDispatch, RootState } from '@/lib/redux/store'
import { useStreamEvents } from '@/lib/hooks/use-stream-processor'
import { processAssistantResponse } from '@/lib/utils/tent-mockup'
import { streamThread, submitToolOutputsStream } from '@/lib/redux/apis/chat'

export function PromptForm({
  input,
  setInput,
  session,
  setIsCarouselOpen
}: {
  input: string
  setInput: (value: string) => void
  session?: Session
  setIsCarouselOpen: (value: boolean) => void
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const dispatch: AppDispatch = useDispatch()
  const [selectedFiles, setSelectedFiles] = React.useState<FileData[]>([])
  const chat = useSelector((state: RootState) => state.chatReducer)
  const { threadId, loading } = chat
  const { tentColors, generatedMockups } = useSelector(
    (state: RootState) => state.tentMockUpPromptReducer
  )
  const [tentColorConfig, setTentColorConfig] = React.useState<TentColorConfig>(
    {
      patterned: false,
      awaitingColorPick: false,
      isMonochrome: false,
      currentRegion: '',
      awaitingFileUpload: false
    }
  )
  const { processStream, assistantResponse, isStreaming } = useStreamEvents()
  React.useEffect(() => {
    if (assistantResponse?.message && !isStreaming) {
      const actions = processAssistantResponse(assistantResponse.message)
      if (actions) {
        setTentColorConfig(prev => ({ ...prev, ...actions }))
      }
      saveChat(chat)
    }
  }, [assistantResponse?.message, isStreaming, chat.messages])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addAssistantResponse = (messageId: string, message: string) => {
    dispatch(
      addMessage({
        id: messageId,
        message,
        role: Roles.assistant,
      })
    )
  }

  async function submitUserMessage(content: string) {
    const userMessage = {
      content,
      role: Roles.user
    }
    let thread
    if (threadId) {
      const message = await dispatch(
        addChatMessage({ threadId, payload: userMessage })
      ).unwrap()
      if (selectedFiles.length) {
        dispatch(
          addMessage({
            ...userMessage,
            id: message.id,
            files: JSON.stringify(selectedFiles)
          })
        )
      }
    } else {
      thread = await dispatch(
        createThread({ messages: [userMessage] })
      ).unwrap()
      dispatch(
        addMessage({
          ...userMessage,
          id: nanoid(),
          message: content,
          files: JSON.stringify(selectedFiles)
        })
      )
    }
    const stream = streamThread(threadId || thread?.id || '')
    if (!stream) return
    await processStream(stream, {
      onDelta: addAssistantResponse,
      onToolCall: async (messageId, toolCallId, payload) => {
        try {
          const mockups = await dispatch(generateTentMockups(payload)).unwrap()
          await dispatch(processTentMockups(mockups)).unwrap()
          await submitToolOutput(messageId, toolCallId)
        } catch (error) {
          console.error('Error during tool call:', error)
        }
      },
      onComplete: addAssistantResponse
    })
  }

  async function submitToolOutput(finalRun: string, toolCallId: string) {
    const stream = submitToolOutputsStream(threadId, finalRun, {
      tool_outputs: [
        {
          output: generatedMockups.length
            ? JSON.stringify(generatedMockups[0])
            : 'Failed to generate Custom Canopy mockups.',
          tool_call_id: toolCallId
        }
      ]
    })
    await processStream(stream, {
      onDelta: addAssistantResponse,
      onComplete: addAssistantResponse
    })
  }

  async function handleColorPick(color: string, colorName: string) {
    dispatch(addMessage({ id: nanoid(), message: colorName, role: Roles.user }))
    const tentColorsObject =
      tentColorConfig.isMonochrome &&
      tentColorConfig.currentRegion === Regions.walls_primary &&
      !tentColorConfig.patterned
        ? {
            slope: color,
            canopy: color,
            walls_primary: color,
            walls_secondary: color,
            walls_tertiary: color
          }
        : { ...tentColors, [tentColorConfig.currentRegion]: color }
    dispatch(
      setMockUpPrompt({
        tentColors: tentColorsObject
      })
    )

    setTentColorConfig(prev => ({
      ...prev,
      awaitingColorPick: false
    }))

    await submitUserMessage(
      `Tent colors are: ${JSON.stringify(tentColorsObject)}`
    )
  }

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

    const messageId = nanoid()

    if (window.innerWidth < 600) {
      ;(e.target as HTMLFormElement)['message']?.blur()
    }

    const value = input.trim()
    setInput('')
    if (selectedFiles.length) {
      const files = await dispatch(
        saveFiles({
          files: selectedFiles,
          threadId: threadId,
          messageId: messageId,
          userId: session?.user?.id || ''
        })
      ).unwrap()
      setSelectedFiles([])
      await submitUserMessage(JSON.stringify(files[0]))
    } else {
      await submitUserMessage(value)
    }
  }

  return (
    <>
      {tentColorConfig.awaitingColorPick ? (
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:px-4">
          <ColorPicker onColorSelect={handleColorPick} disabled={loading} />
        </div>
      ) : (
        <div>
          {generatedMockups.length ? (
            <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 w-full p-2"
                    onClick={() => setIsCarouselOpen(true)}
                  >
                    <IconPicture />
                    <span>View Mockups</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Mockups</TooltipContent>
              </Tooltip>
            </div>
          ) : null}
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
                    disabled={loading}
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
                  disabled={loading}
                />
                <div className="right-0 top-[13px] sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={
                          tentColorConfig.awaitingFileUpload &&
                          selectedFiles.length === 0
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
        </div>
      )}
    </>
  )
}
