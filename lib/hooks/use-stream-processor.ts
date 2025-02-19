import { nanoid } from 'nanoid'
import { AssistantStreamEvent } from 'openai/resources/beta'
import { TextDeltaBlock } from 'openai/resources/beta/threads'
import { useCallback, useState } from 'react'
import { ChatMessage, StreamEvent, TentMockUpPrompt } from '../types'

export interface StreamCallbacks {
  onDelta?: (assistantChatId: string, content: string) => void
  onToolCall?: (
    messageId: string,
    toolCallId: string,
    payload: TentMockUpPrompt
  ) => void
  onComplete?: (assistantChatId: string, content: string) => void
  onError?: (error: Error) => void
}

export function useStreamEvents() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [assistantResponse, setAssistantResponse] = useState<ChatMessage>()

  const processStream = useCallback(
    async (
      stream: AsyncIterable<AssistantStreamEvent>,
      callbacks: StreamCallbacks
    ) => {
      let assistantResponseMessage = ''
      setIsStreaming(true)
      setError(null)
      const assistantChatId = nanoid()
      try {
        for await (const message of stream) {
          switch (message.event) {
            case StreamEvent.DELTA:
              if (message.data.delta?.content) {
                const text =
                  (message.data.delta.content[0] as TextDeltaBlock)?.text
                    ?.value || ''
                assistantResponseMessage += text
                callbacks.onDelta?.(assistantChatId, assistantResponseMessage)
              }
              break
            case StreamEvent.REQUIRES_ACTION:
              const toolCall =
                message.data.required_action?.submit_tool_outputs.tool_calls[0]
              if (toolCall) {
                const payload = JSON.parse(toolCall.function.arguments)
                callbacks.onToolCall?.(message.data.id, toolCall.id, payload)
                break
              }
            case StreamEvent.COMPLETED:
              callbacks.onComplete?.(assistantChatId, assistantResponseMessage)
              break
            case StreamEvent.ERROR:
              throw new Error('Stream error event received')
          }
          setAssistantResponse({
            id: assistantChatId,
            message: assistantResponseMessage
          })
        }
      } catch (error) {
        const streamError =
          error instanceof Error ? error : new Error('Unknown stream error')
        setError(streamError)
        callbacks.onError?.(streamError)
      } finally {
        setIsStreaming(false)
      }
    },
    []
  )

  return {
    processStream,
    assistantResponse,
    isStreaming,
    error
  }
}
