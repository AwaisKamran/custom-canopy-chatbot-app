import { FileData } from '@/lib/types'
import OpenAI from 'openai'
import { MessageCreateParams } from 'openai/resources/beta/threads/messages'
import { Thread, ThreadCreateParams } from 'openai/resources/beta'
import {
  AssistantStream,
  RunSubmitToolOutputsParamsStream
} from 'openai/lib/AssistantStream'
import { PutBlobResult } from '@vercel/blob'

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function createThreadApi(
  payload: ThreadCreateParams
): Promise<Thread> {
  return await openai.beta.threads.create(payload)
}

export async function addChatMessageApi(
  threadId: string,
  payload: MessageCreateParams
): Promise<OpenAI.Beta.Threads.Messages.Message> {
  return await openai.beta.threads.messages.create(threadId, payload)
}

export function streamThread(threadId: string): AssistantStream {
  return openai.beta.threads.runs.stream(threadId, {
    assistant_id: process.env.NEXT_PUBLIC_ASSISTANT_ID || '',
    stream: true
  })
}

export function submitToolOutputsStream(
  chatId: string,
  runId: string,
  payload: RunSubmitToolOutputsParamsStream
): AssistantStream {
  return openai.beta.threads.runs.submitToolOutputsStream(chatId, runId, {
    ...payload,
    stream: true
  })
}

export function cancelRunApi(
  threadId: string,
  runId: string
): Promise<OpenAI.Beta.Threads.Runs.Run> {
  return openai.beta.threads.runs.cancel(threadId, runId)
}

export async function saveFilesApi(
  files: FileData[],
  chatId: string,
  messageId: string,
  userId: string
): Promise<Array<PutBlobResult>> {
  try {
    const fileBlobs = await Promise.all(
      files.map(async file => {
        const response = await fetch(
          `/api/save-files?chatId=${chatId}&filename=${file.file.name}&userId=${userId}&messageId=${messageId}`,
          {
            method: 'POST',
            body: file.file
          }
        )

        if (!response.ok) {
          throw new Error(`File upload failed: ${file.file.name}`)
        }

        return response.json()
      })
    )
    return fileBlobs
  } catch (error) {
    console.error('Bulk file upload error:', error)
    throw error
  }
}
