'use server'

import { getMutableAIState, streamUI } from 'ai/rsc'
import { UserContent } from 'ai'
import { openai } from '@ai-sdk/openai'
import { BotMessage, SpinnerMessage } from '@/components/stocks/message'
import { getToolFunctions } from '@/lib/ai-tools/tool-functions'
import { ClientMessage, Roles } from '@/lib/types'
import { nanoid } from '@/lib/utils'
import { customizeCoreMessages, modifyAIState } from '@/lib/ai-tools/utils'
import { PROMPT_INSTRUCTIONS } from '@/lib/ai-tools/constants'

export async function submitUserMessage(
  content: UserContent
): Promise<ClientMessage> {
  'use server'
  const history = getMutableAIState()
  modifyAIState(
    history,
    {
      role: Roles.user,
      content
    },
    false
  )

  const messageId = nanoid()
  const ui = await streamUI({
    model: openai('gpt-4o'),
    temperature: 0.2,
    messages: [
      {
        role: Roles.system,
        content: PROMPT_INSTRUCTIONS
      },
      ...customizeCoreMessages(history.get().messages)
    ],
    initial: <SpinnerMessage />,
    text: ({ content, done }) => {
      if (done) {
        modifyAIState(history, {
          role: Roles.assistant,
          content
        })
      }
      return <BotMessage key={messageId} content={content} />
    },
    tools: getToolFunctions(history, messageId),
    onFinish: () => {
      history.done({ ...history.get() })
    }
  })

  return {
    id: messageId,
    display: ui.value,
    role: Roles.assistant
  }
}
