import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slice/chat'

export const store = configureStore({
  reducer: {
    chatReducer: chatReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
