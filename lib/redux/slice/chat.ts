import { ChatMessage, Chat, FileData, Roles } from '@/lib/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createThreadApi,
  addChatMessageApi,
  saveFilesApi,
  cancelRunApi
} from '../apis/chat'
import {
  Message,
  MessageCreateParams,
  TextContentBlock
} from 'openai/resources/beta/threads/messages'
import { Thread, ThreadCreateParams } from 'openai/resources/beta'
import { getChat as getChatApi } from '@/app/actions'
import OpenAI from 'openai'
import { isColorMessage } from '@/lib/utils/chat'
import { Error401Response, INITIAL_CHAT_MESSAGE } from '@/app/constants'
import { nanoid } from '@/lib/utils'

interface ChatState extends Chat {
  loading: boolean
  error: string | null | undefined
}

const initialState: ChatState = {
  id: '',
  title: '',
  path: '',
  messages: [
    {
      id: nanoid(),
      message: INITIAL_CHAT_MESSAGE,
      role: Roles.assistant
    }
  ],
  threadId: '',
  loading: false,
  error: null,
  createdAt: new Date()
}

export const createThread = createAsyncThunk<
  Thread,
  ThreadCreateParams,
  { rejectValue: string }
>('chat/createThread', async (payload, { rejectWithValue }) => {
  try {
    return await createThreadApi(payload)
  } catch (error) {
    return rejectWithValue(error as string)
  }
})

export const getChat = createAsyncThunk<
  Chat,
  {
    chatId: string
    userId: string
  },
  { rejectValue: string }
>('chat/getChat', async ({ chatId, userId }, { rejectWithValue }) => {
  try {
    const chat = await getChatApi(chatId, userId)
    if (!chat || chat.error || Error401Response.message in chat) {
      return rejectWithValue(Error401Response.message)
    }
    return chat as Chat
  } catch (error) {
    return rejectWithValue(error as string)
  }
})

export const cancelRun = createAsyncThunk<
  OpenAI.Beta.Threads.Runs.Run,
  {
    threadId: string
    runId: string
  },
  { rejectValue: string }
>('chat/cancelRun', async ({ threadId, runId }, { rejectWithValue }) => {
  try {
    return await cancelRunApi(threadId, runId)
  } catch (error) {
    return rejectWithValue(error as string)
  }
})

export const addChatMessage = createAsyncThunk<
  Message,
  { threadId: string; payload: MessageCreateParams },
  { rejectValue: string }
>('chat/addChatMessage', async ({ threadId, payload }, { rejectWithValue }) => {
  try {
    return await addChatMessageApi(threadId, payload)
  } catch (error) {
    return rejectWithValue(error as string)
  }
})

export const saveFiles = createAsyncThunk<
  FileData[],
  { files: FileData[]; threadId: string; messageId: string; userId: string },
  { rejectValue: string }
>(
  'chat/saveFiles',
  async ({ files, threadId, messageId, userId }, { rejectWithValue }) => {
    try {
      const uploadedfiles = await saveFilesApi(
        files,
        threadId,
        messageId,
        userId
      )
      return uploadedfiles.map((file: any) => {
        return {
          ...file,
          name: file.pathname,
          previewUrl: file.downloadUrl,
          type: file.contentType
        } as FileData
      })
    } catch (error) {
      return rejectWithValue(error as string)
    }
  }
)

const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    initiateChat: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload }
      } else {
        const id = nanoid()
        return { ...initialState, id, path: `/chat/${id}` }
      }
    },
    addMessage: (state, action) => {
      const { id, message, role, files }: ChatMessage = action.payload
      if (!state.title) {
        state.title = message.substring(0, 100) || ''
      }
      const existingMessageIndex = state.messages.findIndex(
        msg => msg.id === id
      )
      if (existingMessageIndex !== -1) {
        state.messages = [
          ...state.messages.slice(0, existingMessageIndex),
          { ...state.messages[existingMessageIndex], message },
          ...state.messages.slice(existingMessageIndex + 1)
        ]
      } else {
        state.messages.push({
          id,
          message,
          role,
          files
        })
      }
    },
    removeMessages: (state, action) => {
      if (action.payload) {
        state.messages = []
      } else {
        state.messages = [
          {
            id: nanoid(),
            message: INITIAL_CHAT_MESSAGE,
            role: Roles.assistant
          }
        ]
      }
    },
    resetChat: () => {
      return initialState
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createThread.pending, state => {
        return { ...state, loading: true, error: null }
      })
      .addCase(createThread.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          threadId: action.payload.id,
          error: null
        }
      })
      .addCase(createThread.rejected, (state, action) => {
        return { ...state, loading: true, error: action.payload }
      })
      .addCase(getChat.pending, state => {
        return { ...state, loading: true, error: null }
      })
      .addCase(getChat.fulfilled, (state, action) => {
        return {
          ...state,
          id: action.payload?.id || '',
          loading: false,
          messages: action.payload?.messages || [],
          title: state.title
            ? state.title
            : action.payload?.messages?.[1]?.message.substring(0, 100) || '',
          path: `/chat/${action.payload?.id}`,
          threadId: action.payload?.threadId || '',
          createdAt: action.payload?.createdAt ?? new Date(),
          error: null
        }
      })
      .addCase(getChat.rejected, (state, action) => {
        return { ...state, loading: false, error: action.payload as string }
      })
      .addCase(addChatMessage.pending, state => {
        return { ...state, loading: true }
      })
      .addCase(addChatMessage.fulfilled, (state, action) => {
        const message = (action.payload.content[0] as TextContentBlock).text
          .value
        if (isColorMessage(message)) {
          return { ...state, loading: false, error: null }
        }
        return {
          ...state,
          loading: false,
          messages: [
            ...state.messages,
            {
              id: action.payload.id,
              message: message,
              role: action.payload.role
            }
          ],
          error: null
        }
      })
      .addCase(addChatMessage.rejected, (state, action) => {
        return { ...state, loading: false, error: action.payload }
      })
      .addCase(saveFiles.pending, state => {
        return { ...state, loading: true }
      })
      .addCase(saveFiles.fulfilled, state => ({
        ...state,
        loading: false,
        error: null
      }))
      .addCase(saveFiles.rejected, (state, action) => {
        return { ...state, loading: false, error: action.payload }
      })
  }
})

export const { addMessage, removeMessages, resetChat, initiateChat } =
  chatSlice.actions
export default chatSlice.reducer
