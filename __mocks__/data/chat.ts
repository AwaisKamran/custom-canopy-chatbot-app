import { faker } from '@faker-js/faker'
import { Chat } from '@/lib/types'
import { RootState } from '@/lib/redux/store'

export const generateMockChat = (userId: string): Chat => ({
  id: faker.string.nanoid(7),
  userId,
  title: faker.lorem.word(),
  threadId: faker.string.nanoid(7),
  messages: Array.from(
    { length: faker.number.int({ min: 1, max: 10 }) },
    () => ({
      id: faker.string.nanoid(7),
      message: faker.lorem.sentence()
    })
  ),
  createdAt: faker.date.recent(),
  sharePath: faker.internet.url(),
  path: faker.internet.url()
})

export const generateMockChats = (userId: string, count: number = 5): Chat[] =>
  Array.from({ length: count }, () => generateMockChat(userId))

export const generateMockFileUrls = (count: number = 3): string[] =>
  Array.from({ length: count }, () => faker.internet.url())

export const preloadPickerState = (
  initialState: RootState,
  upload: boolean = false
) => ({
  preloadedState: {
    ...initialState,
    chatReducer: {
      ...initialState.chatReducer,
      messages: [
        ...initialState.chatReducer.messages,
        {
          id: faker.string.nanoid(7),
          role: 'assistant',
          message: upload ? 'Please upload logo' : 'Please pick a color.'
        }
      ]
    }
  }
})

export const preloadImageMockups = (initialState: RootState) => ({
  preloadedState: {
    ...initialState,
    tentMockUpPromptReducer: {
      ...initialState.tentMockUpPromptReducer,
      generatedMockups: [
        { fileName: faker.system.fileName(), data: faker.image.avatar() }
      ]
    }
  }
})