import { TENT_MOCKUP_VALIDATIONS } from '@/app/constants'
import { TentMockUpPrompt, MockupResponse, MockupIdResponse } from '@/lib/types'
import { createFormData } from '@/lib/utils/tent-mockup'
import { ImagePart } from 'ai'

const fetchLogoFile = async (logo: ImagePart): Promise<File> => {
  const response = await fetch(logo.image as string)
  const blob = await response.blob()
  return new File([blob], logo.type, { type: logo.mimeType })
}

const fetchMockups = async (formData: FormData): Promise<MockupIdResponse> => {
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

  const mockups = await response.json()
  return mockups as MockupIdResponse
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

export async function pollMockupGeneration(
  mockupRequestId: string,
  outputDir: string,
  delay = 2000,
  retries = 10
) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL}/mockup-status?request_id=${mockupRequestId}&output_dir=${outputDir}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch mockup status')
      }

      const data = await response.json()
      if (data.status === 'ready') {
        return data.mockups
      }

      if (data.status === 'error') {
        throw new Error(data.error || 'Mockup generation failed')
      }
    } catch (error) {
      console.error('Polling error:', error)
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  }
}
