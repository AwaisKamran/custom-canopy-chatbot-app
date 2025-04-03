import { PutBlobResult } from '@vercel/blob'
import { FileData, Image } from '@/lib/types'

export async function saveFilesApi(
  files: FileData[],
  chatId: string,
  messageId: string,
  userId: string
): Promise<Array<PutBlobResult>> {
  try {
    const fileBlobs = await Promise.all(
      files.map(async file => {
        const response = await fetch(
          `/api/save-files?chatId=${chatId}&filename=${file.file.name}&userId=${userId}&messageId=${messageId}`,
          {
            method: 'POST',
            body: file.file
          }
        )

        if (!response.ok) {
          throw new Error(`File upload failed: ${file.file.name}`)
        }

        return response.json()
      })
    )
    return fileBlobs
  } catch (error) {
    console.error('Bulk file upload error:', error)
    throw error
  }
}

export const downloadImages = async (images: Image[]): Promise<Blob> => {
  try {
    const response = await fetch('/api/images-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error downloading images:', error)
    throw error
  }
}
