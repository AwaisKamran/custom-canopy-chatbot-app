import { TentMockUpPrompt } from '@/lib/types'
import { createFormData } from '@/lib/utils/tent-mockup'

export const generateTentMockupsApi = async (
  tentMockupPrompt: TentMockUpPrompt
): Promise<Blob> => {
  try {
    if (!tentMockupPrompt.logo) {
      throw new Error('Logo is required')
    }
    const logoResponse = await fetch(tentMockupPrompt.logo.previewUrl)
    const blob = await logoResponse.blob()
    const logoFile = new File([blob], tentMockupPrompt.logo.name || '', { type: tentMockupPrompt.logo.fileType })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL}/create-mockups`,
      {
        method: 'POST',
        body: createFormData({...tentMockupPrompt, logoFile: logoFile}),
        headers: {
          Connection: 'keep-alive'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to generate custom canopy')
    }
    return await response.blob()
  } catch (error: any) {
    throw new Error(error.message || 'Something went wrong!')
  }
}
