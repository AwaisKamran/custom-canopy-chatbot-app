import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json()

    cookies().set('_ga', clientId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })

    return new Response('Client ID saved', { status: 200 })
  } catch (error) {
    return new Response('Error saving client ID', { status: 500 })
  }
}
