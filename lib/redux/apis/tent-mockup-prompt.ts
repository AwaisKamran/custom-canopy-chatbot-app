import { TENT_MOCKUP_VALIDATIONS } from '@/app/constants'
import { TentMockUpPrompt, MockupResponse } from '@/lib/types'
import { createFormData } from '@/lib/utils/tent-mockup'
import { ImagePart } from 'ai'

const fetchLogoFile = async (logo: ImagePart): Promise<File> => {
  const response = await fetch(logo.image as string)
  const blob = await response.blob()
  return new File([blob], logo.type, { type: logo.mimeType })
}

const fetchMockups = async (formData: FormData): Promise<MockupResponse> => {
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
    console.error('Response from the backend is: ', response)
    throw new Error('Failed to generate custom canopy')
  }

  const mockups = await response.json()
  return mockups as MockupResponse
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
    return await fetchMockups(formData)
  } catch (error) {
    throw new Error((error as Error).message || 'Something went wrong!')
  }
}
