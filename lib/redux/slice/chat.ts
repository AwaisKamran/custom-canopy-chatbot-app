import { Chat, Roles } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@/lib/utils'
import { INITIAL_CHAT_MESSAGE } from '@/lib/ai-tools/constants'

interface ChatState extends Chat {
  loading: boolean
  error: string | null | undefined
  version: number
}

const initialState: ChatState = {
  id: '',
  title: '',
  path: '',
  messages: [
    {
      content: INITIAL_CHAT_MESSAGE,
      role: Roles.assistant
    }
  ],
  loading: false,
  error: null,
  createdAt: new Date(),
  version: 0
}

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

    resetChat: () => {
      return initialState
    }
  }
})

export const { resetChat, initiateChat } = chatSlice.actions
export default chatSlice.reducer
