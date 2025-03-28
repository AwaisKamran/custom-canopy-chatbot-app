import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { Image } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { images }: { images: Image[] } = body

  if (!Array.isArray(images)) {
    return NextResponse.json(
      { error: 'Images must be an array.' },
      { status: 400 }
    )
  }

  const zip = new JSZip()

  try {
    for (const image of images) {
      const { filename, url, contentType } = image

      let fileData: ArrayBuffer

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
      }
      fileData = await response.arrayBuffer()
      const extension = contentType ? `.${contentType.split('/')?.[1]}` : ''
      zip.file(filename + extension, fileData)
    }

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="images.zip"'
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process images.' },
      { status: 500 }
    )
  }
}
