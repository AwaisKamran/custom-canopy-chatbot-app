import {
  createInitialAIState,
  createInitialUIState,
  getClientMessages
} from '@/lib/ai-tools/utils'
import { Chat, ClientMessage } from '@/lib/types'
import { createAI, getAIState } from 'ai/rsc'
import { submitUserMessage } from './actions'
import { saveChat } from '../actions'

export const AI = createAI<Chat, ClientMessage[]>({
  actions: {
    submitUserMessage
  },
  initialAIState: createInitialAIState(),
  initialUIState: createInitialUIState(),
  onSetAIState: async ({ state, done }) => {
    'use server'
    if (done) await saveChat(state)
  },
  onGetUIState: async () => {
    'use server'

    const history = getAIState()
    return getClientMessages(history.messages)
  }
})
