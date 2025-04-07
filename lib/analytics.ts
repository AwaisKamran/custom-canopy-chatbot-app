const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const GA_API_SECRET = process.env.GA_API_SECRET

interface GAEvent {
  name: string
  params: Record<string, any>
  clientId: string
  debug_mode?: boolean
}

export async function sendGAEvent({
  name,
  params,
  clientId,
  debug_mode = false
}: GAEvent) {
  if (!GA_TRACKING_ID || !GA_API_SECRET) {
    console.warn('Missing GA credentials.')
    return
  }

  const payload = {
    client_id: clientId,
    events: [
      {
        name,
        params: { ...params, debug_mode: true }
      }
    ]
  }
  try {
    const response = await fetch(
      `https://www.google-analytics.com${debug_mode ? '/debug' : ''}/mp/collect?measurement_id=${GA_TRACKING_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )

    console.log('GA response:', response.status, await response.text())

    if (!response.ok) {
      const text = await response.text()
      console.error(`GA error: ${response.status} - ${text}`)
    }
  } catch (err) {
    console.error('GA send failed:', err)
  }
}
