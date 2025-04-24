import {
  Error400Response,
  Error401Response,
  Error500Response
} from '@/app/constants'
import { auth } from '@/auth'
import { processImage } from '@/lib/redux/apis/tent-mockup-prompt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const chatId = searchParams.get('chatId')
    const filename = searchParams.get('filename')
    const userId = searchParams.get('userId')
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const currentUser = session?.user?.id

    if (!chatId || !file || (!filename && !userId)) {
      return NextResponse.json({
        status: Error400Response.status,
        error: Error400Response.message
      })
    }

    const outputDir = userId
      ? currentUser === userId
        ? `user:${userId}/chat:${chatId}`
        : null
      : `temp/anon/chat:${chatId}/${filename}`

    if (!outputDir) {
      return NextResponse.json({
        status: Error401Response.status,
        message: Error401Response.message
      })
    }

    const data = await processImage(file, outputDir)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      status: Error500Response.status,
      message: (error as Error).message || Error500Response.message
    })
  }
}
