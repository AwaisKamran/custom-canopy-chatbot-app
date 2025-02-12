import { convertToBGR } from '.'
import { TentMockUpPrompt } from '../types'
import { ASSISTANT_RESPONSE_CONFIG, COLORS } from '@/app/constants'

export const createFormData = (mockUpPrompt: TentMockUpPrompt): FormData => {
  const { logo, tentColors, text, fontColor, isPatterned } = mockUpPrompt
  const formRequestBody = new FormData()

  formRequestBody.append(
    'slope_color',
    convertToBGR(tentColors.slope) || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'canopy_color',
    convertToBGR(tentColors.canopy) || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_primary_color',
    convertToBGR(tentColors.walls_primary) || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_secondary_color',
    convertToBGR(tentColors.walls_secondary) || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append(
    'walls_tertiary_color',
    convertToBGR(tentColors.walls_tertiary) || COLORS.LIGHT_GREY_COLOR
  )
  formRequestBody.append('text', text)
  formRequestBody.append('logo', logo?.previewUrl || '')
  formRequestBody.append('text_color', fontColor || COLORS.BLACK_COLOR)
  formRequestBody.append('patterned', `${isPatterned}`)

  return formRequestBody
}

export const processAssistantResponse = (responseMessage: string) => {
  const lowerResponse = responseMessage.toLowerCase()
  let actions = {}
  for (const rule of ASSISTANT_RESPONSE_CONFIG) {
    const matchesConditions = rule.conditions.every(condition =>
      lowerResponse.includes(condition)
    )
    const matchesExcludes = rule.excludes
      ? rule.excludes.some(exclude => lowerResponse.includes(exclude))
      : false

    if (matchesConditions && !matchesExcludes) {
      actions = { ...actions, ...rule.actions }
    }
  }
  return actions
}
