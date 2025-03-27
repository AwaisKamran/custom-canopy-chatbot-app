import { TentMockUpPrompt } from '../types'
import { COLORS } from '@/app/constants'

interface TentMockUpPromptFormData extends TentMockUpPrompt {
  logoFile: File
}

export const createFormData = (
  mockUpPrompt: TentMockUpPromptFormData
): FormData => {
  const {
    id,
    logoFile,
    tentType,
    tableColor,
    peaks,
    walls,
    valences,
    valencesTexts
  } = mockUpPrompt
  const formRequestBody = new FormData()

  Object.entries(peaks).forEach(([key, value]) => {
    formRequestBody.append(`peaks_${key}`, value)
  })

  if (tentType !== 'no-walls') {
    Object.entries(walls).forEach(([key, value]) => {
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
  if (tableColor) formRequestBody.append('table_color', tableColor)
  formRequestBody.append('output_dir', `chat:${id}`)

  return formRequestBody
}
