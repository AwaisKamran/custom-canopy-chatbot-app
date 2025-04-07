import { sendGAEvent } from '@/lib/analytics'
import { AnalyticsEvent, EventTypes } from '@/lib/types/ga'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AnalyticsEvent
  const { event, context, data, clientId } = body

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID not found' }, { status: 400 })
  }
  switch (event) {
    case EventTypes.ORDER_STARTED:
    case EventTypes.CHECKOUT_STARTED:
    case EventTypes.ORDER_COMPLETED:
      await sendGAEvent({
        name: event,
        params: { ...context, ...data },
        clientId
      })
      break

    case EventTypes.MOCKUP_GENERATED: {
      if (data) {
        const { addOns, ...rest } = data

        const params = {
          ...context,
          ...rest
        }

        await sendGAEvent({
          name: EventTypes.MOCKUP_GENERATED,
          params: { ...params, addOnsCount: addOns.length },
          clientId
        })

        for (const addOn of addOns) {
          await sendGAEvent({
            name: EventTypes.ADD_ON_USED,
            params: {
              ...context,
              addOn: addOn
            },
            clientId
          })
        }
      }
      break
    }

    default:
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
