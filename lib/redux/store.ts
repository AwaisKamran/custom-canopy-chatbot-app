import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slice/chat'
import tentMockupPromptReducer from './slice/tent-mockup-prompt'

export const store = configureStore({
  reducer: {
    chatReducer: chatReducer,
    tentMockUpPromptReducer: tentMockupPromptReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
