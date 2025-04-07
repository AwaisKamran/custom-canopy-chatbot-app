'use server'

import { AnalyticsEvent } from '@/lib/types/ga'
import { cookies } from 'next/headers'

export async function trackAnalyticsEvent(eventPayload: AnalyticsEvent) {
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...eventPayload,
      clientId: cookies().get('_ga')?.value
    })
  })
}
