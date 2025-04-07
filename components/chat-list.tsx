import { ClientMessage } from '@/lib/types'
import { useUIState } from 'ai/rsc'

export function ChatList() {
  const [messages, _] = useUIState()

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((item: ClientMessage) => (
        <div key={item.id}>{item.display}</div>
      ))}
    </div>
  )
}
