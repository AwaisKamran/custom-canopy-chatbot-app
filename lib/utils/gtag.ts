'use client'

import { AnalyticsEvent } from '../types/ga'

export const pageview = (url: string, debug_mode: boolean = false) => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      debug_mode,
      page_path: url
    })
  }
}

export const sendClientIdToServer = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    window.gtag(
      'get',
      process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      'client_id',
      async (clientId: string) => {
        if (!clientId) {
          console.error('Client ID is missing from Google Analytics')
          return
        }

        try {
          const response = await fetch('/api/save-client-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clientId })
          })

          if (!response.ok) {
            console.error('Failed to send client_id to the server')
          } else {
            console.log('Successfully sent client_id to the server')
          }
        } catch (error) {
          console.error('Error sending client_id to the server:', error)
        }
      }
    )
  }
}

export const trackEvent = ({ event, context, data = {} }: AnalyticsEvent, debug_mode: boolean = false) => {
  if (
    typeof window === 'undefined' ||
    !window.gtag ||
    !process.env.NEXT_PUBLIC_GA_TRACKING_ID
  ) {
    return
  }

  if (!context.userId) {
    context.userId = 'Anonymous'
  }

  const params = {
    ...context,
    ...data,
    debug_mode,
  }

  window.gtag(
    'get',
    process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    'client_id',
    (clientId: string) => {
      if (!clientId) {
        console.error('Client ID is missing from Google Analytics')
        return
      }
      window.gtag('event', event, {
        ...params,
        client_id: clientId
      })
    }
  )
}
