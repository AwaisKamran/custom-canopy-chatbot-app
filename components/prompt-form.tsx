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
import { Chat, FileData, Session, TentColorRegions } from '@/lib/types'
import { getChat, saveChat } from '@/app/actions'
import { addMessage, Roles, setThreadId } from '@/lib/redux/slice/chat.slice'
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
  setMockups,
  id
}: {
  input: string
  setInput: (value: string) => void
  session?: Session
  mockups: any
  setIsCarouselOpen: (value: boolean) => void
  setMockups: (value: any) => void
  id?: string
}) {
  const openai = new OpenAI({
    apiKey: openAIApiKey,
    dangerouslyAllowBrowser: true
  })
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()
  const [selectedFiles, setSelectedFiles] = React.useState<FileData[]>([])
  const [awaitingFileUpload, setAwaitingFileUpload] =
    React.useState<boolean>(false)
  const messages = useSelector((state: any) => state.chat.messages)
  const threadId = useSelector((state: any) => state.chat.threadId)
  const [awaitingColorPick, setAwaitingColorPick] =
    React.useState<boolean>(false)
  const [isMonochrome, setIsMonochrome] = React.useState<boolean>(true)
  const [currentRegion, setCurrentRegion] = React.useState<
    'slope' | 'canopy' | 'walls'
  >('slope')
  const [isAssistantRunning, setIsAssistantRunning] =
    React.useState<boolean>(false)
  const [tentColors, setTentColors] = React.useState<TentColorRegions>({
    slope: '',
    canopy: '',
    walls: ''
  })

  const saveFiles = async (files: FileData[], messageId: string) => {
    const fileBlobs: any[] = []
    try {
      for (const file of files) {
        const response = await fetch(
          `/api/save-files?chatId=${id}&filename=${file.file.name}&userId=${session?.user.id}&messageId=${messageId}`,
          {
            method: 'POST',
            body: file.file
          }
        )

        if (!response.ok) {
          const error = `Unable to save uploaded files. Response is ${response}`
          throw new Error(error)
        } else {
          const value = await response.json()
          console.log(`Saved uploaded files successfully: ${value}`)
          fileBlobs.push({
            name: value.pathname,
            previewUrl: value.downloadUrl,
            type: value.contentType
          })
        }
      }
      return fileBlobs
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const getCurrentChat = async (
    messageId: string,
    value: string,
    files: any[]
  ) => {
    const createdAt = new Date()
    const firstMessageContent = value as string
    const title = firstMessageContent.substring(0, 100)

    let currentThreadId = threadId
    let chat: Chat

    if (!threadId) {
      const emptyThread = await openai.beta.threads.create()
      dispatch(setThreadId(emptyThread.id))
      currentThreadId = emptyThread.id

      chat = {
        id: id as string,
        title,
        createdAt,
        path: `/chat/${id}`,
        messages: [
          ...messages,
          {
            id: messageId,
            message: value,
            role: Roles.user,
            files: JSON.stringify(files)
          }
        ],
        threadId: currentThreadId
      }
    } else {
      chat = (await getChat(id as string, session?.user?.id as string)) as Chat
      if (!chat) {
        throw new Error('Chat not found!')
      }

      chat.messages = [
        ...(chat.messages || []),
        {
          id: messageId,
          role: Roles.user,
          message: value,
          files: JSON.stringify(files)
        }
      ]
      currentThreadId = chat.threadId
    }

    return { currentThreadId, chat }
  }

  async function submitUserMessage(
    messageId: string,
    value: string,
    files: any[]
  ) {
    const { currentThreadId, chat } = await getCurrentChat(
      messageId,
      value,
      files
    )

    await openai.beta.threads.messages.create(currentThreadId, {
      role: Roles.user,
      content: value
    })

    const stream = await openai.beta.threads.runs.stream(currentThreadId, {
      assistant_id: openAIAssistantId || '',
      stream: true
    })

    let assistantResponse = ''
    const newAssistantChatId = nanoid()

    for await (const message of stream) {
      if (
        message.event === 'thread.message.delta' &&
        message.data.delta.content
      ) {
        const text = (message.data.delta.content[0] as any).text.value
          ? (message.data.delta.content[0] as any).text.value
          : ''
        assistantResponse += text

        dispatch(
          addMessage({
            id: newAssistantChatId,
            message: assistantResponse,
            role: Roles.assistant
          })
        )
      } else if (message.event === 'thread.run.requires_action') {
        const toolCall =
          message.data.required_action?.submit_tool_outputs.tool_calls[0]
        const args = JSON.parse(toolCall?.function.arguments || '')
        const {
          companyName,
          tentColors,
          text,
          userName,
          email,
          phoneNumber,
          logo,
          fontColor
        } = args

        setAwaitingFileUpload(false)

        const bgrColors = { slope: '', canopy: '', walls: '' }
        const convertToBGR = (rgb: string) => {
          const [r, g, b] = JSON.parse(rgb)
          return `[${b}, ${g}, ${r}]`
        }

        bgrColors.slope = convertToBGR(tentColors.slope)
        bgrColors.canopy = convertToBGR(tentColors.canopy)
        bgrColors.walls = convertToBGR(tentColors.walls)

        const generatedMockups = await generateCustomCanopy(
          bgrColors,
          text,
          logo,
          fontColor
        )
        console.log(
          `The mockups have been generated successfully: ${generatedMockups}`
        )
        await submitToolOutput(
          generatedMockups,
          message.data.id,
          toolCall?.id as string,
          chat
        )
        setIsAssistantRunning(false)
        await saveChat(chat)
        return {
          id: messageId,
          message: value,
          role: Roles.user
        }
      }
    }

    if (assistantResponse.toLowerCase().includes('slope')) {
      setCurrentRegion('slope')
      setIsMonochrome(false)
    }

    if (
      assistantResponse.toLowerCase().includes('canopy') &&
      !assistantResponse.toLowerCase().includes('custom')
    ) {
      setCurrentRegion('canopy')
      setIsMonochrome(false)
    }

    if (
      assistantResponse.toLowerCase().includes('walls') &&
      assistantResponse.toLowerCase().includes('color')
    ) {
      setCurrentRegion('walls')
      setIsMonochrome(false)
    }

    if (
      !assistantResponse.toLowerCase().includes('slope') &&
      !assistantResponse.toLowerCase().includes('canopy') &&
      !assistantResponse.toLowerCase().includes('walls') &&
      assistantResponse.toLowerCase().includes('color')
    ) {
      setIsMonochrome(true)
    }

    if (
      assistantResponse.toLowerCase().includes('color') &&
      !assistantResponse.toLowerCase().includes('logo') &&
      !assistantResponse.toLowerCase().includes('text') &&
      !assistantResponse.toLowerCase().includes('monochrome') &&
      !assistantResponse.toLowerCase().includes('different regions') &&
      !assistantResponse.toLowerCase().includes('mockup') &&
      !assistantResponse.toLowerCase().includes('just to confirm')
    ) {
      setAwaitingColorPick(true)
    }

    if (
      assistantResponse.toLowerCase().includes('logo') &&
      !assistantResponse.toLowerCase().includes('color')
    ) {
      setAwaitingFileUpload(true)
    }

    const assistantMessage = {
      id: newAssistantChatId,
      message: assistantResponse,
      role: Roles.assistant
    }

    dispatch(addMessage(assistantMessage))

    chat.messages
      ? chat.messages.push(assistantMessage)
      : (chat.messages = [assistantMessage])

    await saveChat(chat)
    return {
      id: messageId,
      message: value,
      role: Roles.user
    }
  }

  async function generateCustomCanopy(
    tentColors: TentColorRegions,
    text: string,
    logo: any,
    fontColor: string
  ) {
    const formRequestBody = new FormData()
    const logoResponse = await fetch(logo.previewUrl)
    const blob = await logoResponse.blob()
    const logoFile = new File([blob], logo.name, { type: logo.contentType })

    formRequestBody.append('slope_color', tentColors.slope || '[250, 250, 250]')
    formRequestBody.append(
      'canopy_color',
      tentColors.canopy || '[250, 250, 250]'
    )
    formRequestBody.append('walls_color', tentColors.walls || '[250, 250, 250]')
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
    toolCallId: string,
    chat: Chat
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
    const stream = await openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      finalRun,
      {
        tool_outputs: toolOutputs,
        stream: true
      }
    )

    let assistantResponse = ''
    const newAssistantChatId = nanoid()
    for await (const message of stream) {
      if (
        message.event === 'thread.message.delta' &&
        message.data.delta.content
      ) {
        const text = (message.data.delta.content[0] as any).text.value
          ? (message.data.delta.content[0] as any).text.value
          : ''
        assistantResponse += text

        dispatch(
          addMessage({
            id: newAssistantChatId,
            message: assistantResponse,
            role: Roles.assistant
          })
        )
      } else if (message.event === 'thread.message.completed') {
        console.log('Tool outputs submitted successfully')
        const assistantMessage = {
          id: newAssistantChatId,
          message: assistantResponse,
          role: Roles.assistant
        }
        dispatch(addMessage(assistantMessage))

        chat.messages
          ? chat.messages.push(assistantMessage)
          : (chat.messages = [assistantMessage])
        setMockups(generatedMockups)
      }
    }
  }

  async function handleColorPick(
    color: string,
    colorName: string,
    fontColor: string
  ) {
    setIsAssistantRunning(true)
    const messageId = nanoid()
    dispatch(addMessage({ id: messageId, message: colorName, role: 'user' }))
    if (isMonochrome) {
      setTentColors({
        slope: color,
        canopy: color,
        walls: color
      })
      await submitUserMessage(
        messageId,
        `Tent colors are: ${JSON.stringify({ slope: color, canopy: color, walls: color })} and font color is ${fontColor}`,
        []
      )
      setAwaitingColorPick(false)
    } else {
      if (currentRegion === 'slope') {
        setTentColors({ ...tentColors, slope: color })
        setAwaitingColorPick(false)
        await submitUserMessage(
          messageId,
          `Tent colors are: ${JSON.stringify({ ...tentColors, slope: color })}`,
          []
        )
      } else if (currentRegion === 'canopy') {
        setTentColors({ ...tentColors, canopy: color })
        setAwaitingColorPick(false)
        await submitUserMessage(
          messageId,
          `Tent colors are: ${JSON.stringify({ ...tentColors, canopy: color })} and font color is ${fontColor}`,
          []
        )
      } else {
        setTentColors({ ...tentColors, walls: color })
        setAwaitingColorPick(false)
        await submitUserMessage(
          messageId,
          `Tent colors are: ${JSON.stringify({ ...tentColors, walls: color })}`,
          []
        )
      }
    }
    setIsAssistantRunning(false)
  }

  const handleFileSelect = (files: FileData[]) => {
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

    const messageId = nanoid()

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      e.target['message']?.blur()
    }

    const value = input.trim()
    setInput('')
    if (!value && !awaitingFileUpload) return

    // Submit and get response message
    let files: any[] = []
    if (!awaitingFileUpload) {
      dispatch(addMessage({ id: messageId, message: value, role: Roles.user }))
      setSelectedFiles([]) // ignore file uploads if files are not asked for by the ai
      await submitUserMessage(messageId, value, files)
      setIsAssistantRunning(false)
    } else {
      if (selectedFiles.length === 0) {
        dispatch(
          addMessage({ id: messageId, message: value, role: Roles.user })
        )
        dispatch(
          addMessage({
            id: nanoid(),
            message:
              'I apologize but I would need this information to proceed. To complete your custom canopy design, please upload your logo.',
            role: Roles.assistant
          })
        )
        setIsAssistantRunning(false)
        return
      }
      const currFiles = selectedFiles.map(fileData => {
        return {
          file: fileData.file,
          name: fileData.name,
          previewUrl: fileData.previewUrl
        } as FileData
      })
      setSelectedFiles([])
      files = (await saveFiles(currFiles, messageId)) || []

      dispatch(
        addMessage({
          id: messageId,
          message: `${value}`,
          role: Roles.user,
          files: JSON.stringify(files)
        })
      )
      await submitUserMessage(messageId, JSON.stringify(files[0]), files)
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
