import { TentMockUpPrompt } from '../types'
import { COLORS } from '@/app/constants'

interface TentMockUpPromptFormData extends TentMockUpPrompt {
  logoFile: File
}

export const createFormData = (
  mockUpPrompt: TentMockUpPromptFormData
): FormData => {
  const { logoFile, tentType, peaks, panels, valences, valencesTexts } =
    mockUpPrompt
  const formRequestBody = new FormData()

  Object.entries(peaks).forEach(([key, value]) => {
    formRequestBody.append(`peaks_${key}`, value)
  })

  if (tentType !== 'no-walls') {
    Object.entries(panels).forEach(([key, value]) => {
      formRequestBody.append(`panels_${key}`, value)
    })
  }
  Object.entries(valences).forEach(([key, value]) => {
    formRequestBody.append(`valences_${key}`, value)
  })

  Object.entries(valencesTexts).forEach(([key, value]) => {
    formRequestBody.append(`${key}_text`, value)
  })

  formRequestBody.append('logo', logoFile)
  formRequestBody.append('text_color', COLORS.BLACK_COLOR)

  return formRequestBody
}
