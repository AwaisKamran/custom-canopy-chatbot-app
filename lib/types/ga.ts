export type AddOnType =
  | 'half-walls'
  | 'separate-colors'
  | 'separate-texts'
  | 'table'
export enum EventTypes {
  ORDER_STARTED = 'order_started',
  MOCKUP_GENERATED = 'mockup_generated',
  CHECKOUT_STARTED = 'checkout_started',
  ORDER_COMPLETED = 'order_completed',
  ADD_ON_USED = 'add_on_used'
}
interface ContextBase {
  chatId: string
  messageId?: string
  userId?: string
}

export type AnalyticsEvent = {
  clientId?: string
  event: EventTypes
  context: ContextBase
  data?: Record<string, any>
}
