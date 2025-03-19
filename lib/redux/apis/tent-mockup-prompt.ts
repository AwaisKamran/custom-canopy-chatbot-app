import { TENT_MOCKUP_VALIDATIONS } from '@/app/constants'
import { TentMockUpPrompt } from '@/lib/types'
import { createFormData } from '@/lib/utils/tent-mockup'
import { ImagePart } from 'ai'
import JSZip from 'jszip'

const fetchLogoFile = async (logo: ImagePart): Promise<File> => {
  const response = await fetch(logo.image as string)
  const blob = await response.blob()
  return new File([blob], logo.type, { type: logo.mimeType })
}

const fetchMockupZip = async (formData: FormData): Promise<Blob> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL}/create-mockups`,
    {
      method: 'POST',
      body: formData,
      headers: {
        Connection: 'keep-alive'
      }
    }
  )
  if (!response.ok) {
    throw new Error('Failed to generate custom canopy')
  }

  return response.blob()
}

const extractImagesFromZip = async (
  zipBlob: Blob
): Promise<{ fileName: string; data: string }[]> => {
  const jszip = new JSZip()
  console.log('initialize jszip')
  const zip = await jszip.loadAsync(zipBlob.arrayBuffer())
  console.log('load zip')

  const extractedImages: { fileName: string; data: string }[] = []
  console.log('initialize extractedImages')
  const filePromises = Object.keys(zip.files).map(async relativePath => {
    const fileData = await zip.files[relativePath].async('base64')
    extractedImages.push({
      fileName: relativePath,
      data: `data:image/jpeg;base64,${fileData}`
    })
  })
  console.log('initialize filePromises')

  await Promise.all(filePromises)
  console.log('add extractedImages', extractedImages)
  return extractedImages
}

export const generateTentMockupsApi = async (
  tentMockupPrompt: TentMockUpPrompt
) => {
  try {
    if (!tentMockupPrompt?.logo) {
      throw new Error(TENT_MOCKUP_VALIDATIONS.logoRequired)
    }
    const logoFile = await fetchLogoFile(tentMockupPrompt.logo)
    const formData = createFormData({ ...tentMockupPrompt, logoFile })
    console.log('add formData', formData)
    const zipBlob = await fetchMockupZip(formData)
    console.log('add zipBlob', zipBlob)
    return await extractImagesFromZip(zipBlob)
  } catch (error) {
    throw new Error((error as Error).message || 'Something went wrong!')
  }
}
