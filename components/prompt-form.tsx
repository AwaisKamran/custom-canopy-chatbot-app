'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import JSZip from 'jszip'

import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPicture } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { Chat, Session } from '@/lib/types'
import { getChat, saveChat } from '@/app/actions'
import { addMessage, setChatId } from '@/lib/redux/slice/chat.slice'
import { useDispatch, useSelector } from 'react-redux'
import FileUploadPopover from './file-upload-popover'
import OpenAI from 'openai'
import FilePreview from './file-preview'
import ColorPicker from './color-picker'

const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const openAIAssistantId = process.env.NEXT_PUBLIC_ASSISTANT_ID
const backendUrl = `${process.env.NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL}`

export function PromptForm({
  input,
  setInput,
  session,
  mockups,
  setIsCarouselOpen,
  setMockups
}: {
  input: string
  setInput: (value: string) => void
  session?: Session
  mockups: any
  setIsCarouselOpen: (value: boolean) => void
  setMockups: (value: any) => void
}) {
  const openai = new OpenAI({
    apiKey: openAIApiKey,
    dangerouslyAllowBrowser: true
  })
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()
  const [selectedFiles, setSelectedFiles] = React.useState<
    { file: File; previewUrl: string; textSnippet: string }[]
  >([])
  const chatId = useSelector((state: any) => state.chat.chatId)
  const [awaitingFileUpload, setAwaitingFileUpload] =
    React.useState<boolean>(false)
  const messages = useSelector((state: any) => state.chat.messages)
  const [threadId, setThreadId] = React.useState<string>('')
  const [awaitingColorPick, setAwaitingColorPick] =
    React.useState<boolean>(false)
  const [bgrColor, setBgrColor] = React.useState<string>('')
  const [isAssistantRunning, setIsAssistantRunning] =
    React.useState<boolean>(false)
  const [fontColor, setFontColor] = React.useState<string>('')
  const [logoFile, setLogoFile] = React.useState<File | null>(null)

  async function submitUserMessage(currentChatId: string, value: string) {
    let chat = await getChat(currentChatId, session?.user.id as string)
    if (!chat) {
      const createdAt = new Date()
      const path = `/chat/${currentChatId}`
      const firstMessageContent = value as string
      const title = firstMessageContent.substring(0, 100)
      const emptyThread = await openai.beta.threads.create()

      chat = {
        id: currentChatId,
        title,
        createdAt,
        path,
        threadId: emptyThread.id
      }
      await saveChat(chat)
    }

    setThreadId((chat as Chat).threadId)
    await openai.beta.threads.messages.create((chat as Chat).threadId, {
      role: 'user',
      content: value
    })

    let run = await openai.beta.threads.runs.createAndPoll(
      (chat as Chat).threadId,
      {
        assistant_id: openAIAssistantId || ''
      }
    )

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id)

      const newAssistantChatId = nanoid()
      const reversedMessages = messages.data.reverse()

      const assistantResponse =
        // @ts-ignore
        reversedMessages[reversedMessages.length - 1].content[0].text.value

      if (
        assistantResponse.toLowerCase().includes('base color') &&
        !assistantResponse.toLowerCase().includes('logo')
      ) {
        setAwaitingColorPick(true)
      }

      if (
        assistantResponse.toLowerCase().includes('logo') &&
        !assistantResponse.toLowerCase().includes('color')
      ) {
        setAwaitingFileUpload(true)
      }

      dispatch(
        addMessage({
          id: newAssistantChatId,
          message: assistantResponse,
          role: 'assistant'
        })
      )
    } else if (run.status === 'requires_action') {
      const toolCall = run.required_action?.submit_tool_outputs.tool_calls[0]
      const args = JSON.parse(toolCall?.function.arguments || '')
      const { companyName, color, text, userName, email, phoneNumber, logo } =
        args

      setAwaitingFileUpload(false)

      const generatedMockups = await generateCustomCanopy(bgrColor, text)
      console.log(
        `The mockups have been generated successfully: ${generatedMockups}`
      )
      await submitToolOutput(generatedMockups, run.id, toolCall?.id as string)
      setIsAssistantRunning(false)

      return
    } else {
      console.error(run.status)
    }

    return {
      id: currentChatId,
      message: value,
      role: 'user'
    }
  }

  async function generateCustomCanopy(baseColor: string, text: string) {
    const formRequestBody = new FormData()
    formRequestBody.append('color', baseColor)
    formRequestBody.append('text', text)
    formRequestBody.append('logo', logoFile as any)
    formRequestBody.append('text_color', fontColor || '[0, 0, 0]')

    try {
      const response = await fetch(`${backendUrl}/create-mockups`, {
        method: 'POST',
        body: formRequestBody,
        headers: {
          Connection: 'keep-alive'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate custom canopy')
      }

      const blob = await response.blob()
      const zip = await JSZip.loadAsync(blob)

      const generatedMockups: { filename: any; data: string }[] = []
      const filePromises: Promise<void>[] = []
      zip.forEach((relativePath, file) => {
        const promise = file.async('base64').then(fileData => {
          const imageSrc = `data:image/jpeg;base64,${fileData}`
          generatedMockups.push({ filename: relativePath, data: imageSrc })
        })
        filePromises.push(promise)
      })
      await Promise.all(filePromises)

      return generatedMockups
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function submitToolOutput(
    generatedMockups: any,
    finalRun: string,
    toolCallId: string
  ) {
    let toolOutputs
    if (!generatedMockups) {
      console.error('Something went wrong generating mockups.')
      toolOutputs = [
        {
          output: JSON.stringify('Failed to generate Custom Canopy mockups.'),
          tool_call_id: toolCallId
        }
      ]
    } else {
      toolOutputs = [
        {
          output: JSON.stringify(generatedMockups[0]),
          tool_call_id: toolCallId
        }
      ]
    }

    console.log('Submitting tool outputs: ', toolOutputs)
    // Submit the result to the assistant
    const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
      threadId,
      finalRun,
      {
        tool_outputs: toolOutputs
      }
    )
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id)

      const newAssistantChatId = nanoid()
      const reversedMessages = messages.data.reverse()

      const assistantResponse =
        // @ts-ignore
        reversedMessages[reversedMessages.length - 1].content[0].text.value

      dispatch(
        addMessage({
          id: newAssistantChatId,
          message: assistantResponse,
          role: 'assistant'
        })
      )
      setMockups(generatedMockups)
    } else {
      console.error('Unable to submit tool outputs: ', run.status)
    }
  }

  async function handleColorPick(
    color: string,
    colorName: string,
    fontColor: string
  ) {
    setIsAssistantRunning(true)
    setFontColor(fontColor)
    let currentChatId
    if (!chatId) {
      const newChatId = nanoid()
      dispatch(setChatId(newChatId))
      currentChatId = newChatId
    } else {
      currentChatId = chatId
    }
    dispatch(
      addMessage({ id: currentChatId, message: colorName, role: 'user' })
    )
    await submitUserMessage(currentChatId, colorName)
    setBgrColor(color)
    setAwaitingColorPick(false)
    setIsAssistantRunning(false)
  }

  const handleFileSelect = (
    files: { file: File; previewUrl: string | null }[]
  ) => {
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles: any[]) =>
      prevFiles.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsAssistantRunning(true)

    const currentChatId = chatId || nanoid()
    if (!chatId) dispatch(setChatId(currentChatId))

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      e.target['message']?.blur()
    }

    const value = input.trim()
    setInput('')
    if (!value && !awaitingFileUpload) return

    // Submit and get response message
    if (!awaitingFileUpload) {
      dispatch(addMessage({ id: currentChatId, message: value, role: 'user' }))
      setSelectedFiles([])
      await submitUserMessage(currentChatId, value)
      setIsAssistantRunning(false)
    } else {
      if (selectedFiles.length === 0) {
        dispatch(
          addMessage({ id: currentChatId, message: value, role: 'user' })
        )
        dispatch(
          addMessage({
            id: nanoid(),
            message:
              'I apologize but I would need this information to proceed. To complete your custom canopy design, please upload your logo.',
            role: 'assistant'
          })
        )
        setIsAssistantRunning(false)
        return
      }
      const logoFile = selectedFiles[0].file
      const previewUrl = URL.createObjectURL(logoFile)

      dispatch(
        addMessage({
          id: currentChatId,
          message: `${value}`,
          role: 'user',
          file: {
            name: logoFile.name,
            previewUrl: previewUrl
          }
        })
      )
      setLogoFile(logoFile)
      setSelectedFiles([])
      await submitUserMessage(currentChatId, previewUrl)
      setIsAssistantRunning(false)
      setAwaitingFileUpload(false)
    }
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      {awaitingColorPick ? (
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:px-4">
          <ColorPicker
            onColorSelect={handleColorPick}
            disabled={isAssistantRunning}
          />
        </div>
      ) : (
        <div>
          {mockups && (
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
          )}
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
                    disabled={isAssistantRunning}
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
                  disabled={isAssistantRunning}
                />
                <div className="right-0 top-[13px] sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={
                          (!awaitingFileUpload && input === '') ||
                          (awaitingFileUpload && selectedFiles.length === 0)
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
