import { TentMockUpPrompt } from '../types'
import { COLORS } from '@/app/constants'

interface TentMockUpPromptFormData extends TentMockUpPrompt {
  logoFile: File
}

export const createFormData = (
  mockUpPrompt: TentMockUpPromptFormData
): FormData => {
  const { logoFile, tentColors, text, isPatterned } = mockUpPrompt
  const formRequestBody = new FormData()

  formRequestBody.append(
    'slope_color',
    tentColors.slope || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'canopy_color',
    tentColors.canopy || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_primary_color',
    tentColors.walls_primary || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_secondary_color',
    tentColors.walls_secondary || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_tertiary_color',
    tentColors.walls_tertiary || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append('text', text)
  formRequestBody.append('logo', logoFile)
  formRequestBody.append('text_color', COLORS.BLACK_COLOR)
  formRequestBody.append('patterned', `${isPatterned}`)

  return formRequestBody
}
