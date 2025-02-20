import { configureStore } from '@reduxjs/toolkit'
import { RootState } from '@/lib/redux/store'
import chatReducer from '@/lib/redux/slice/chat'
import tentMockUpPromptReducer from '@/lib/redux/slice/tent-mockup-prompt'

export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      chatReducer,
      tentMockUpPromptReducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false
      }),
    preloadedState: preloadedState as any
  })
}
