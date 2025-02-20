import { NextRequest } from 'next/server'

export const getUrlWithParams = (baseUrl: string, params: Record<string, string>): string => {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}


export const createValidParams = (testData: {
  chatId: string
  filename: string
  userId: string
}) => ({
  chatId: testData.chatId,
  filename: testData.filename,
  userId: testData.userId
})