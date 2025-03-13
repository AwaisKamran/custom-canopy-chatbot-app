import { TENT_MOCKUP_VALIDATIONS } from '@/app/constants'
import { z } from 'zod'

export const ButtonToolSchema = z.object({
  content: z.array(z.string()).describe('The prompt for the button group'),
  options: z
    .array(
      z.object({
        name: z.string().describe('The name for the button'),
        value: z.string().describe('The value for the button')
      })
    )
    .describe('The options to display')
    .nonempty()
})

export const ColorPickerToolSchema = z.object({
  content: z.array(z.string()).describe('The prompt for the button group'),
})

export const CustomCanopyToolSchema = z.object({
  content: z
    .array(z.string())
    .describe(
      'The content to be displayed for the canopy tool while waiting and after the image is generated'
    )
    .length(2),
  payload: z
    .object({
      companyName: z.string().describe('Name of the company or organization'),
      isPatterned: z
        .boolean()
        .describe('Will a pattern be included on the tent?'),
      tentColors: z
        .object({
          slope: z.string().describe('Color of the slope'),
          canopy: z.string().describe('Color of the canopy'),
          walls_primary: z.string().describe('Primary color of the walls'),
          walls_secondary: z.string().describe('Secondary color of the walls'),
          walls_tertiary: z.string().describe('Tertiary color of the walls')
        })
        .describe('Colors of the tent')
        .required(),
      text: z.string().describe('Text to be displayed on the tent banner'),
      logo: z
        .object({
          image: z.string().describe('The image file uploaded'),
          mimeType: z
            .string()
            .describe('The mime type of the image file uploaded'),
          type: z.string().describe('The type of the image file uploaded')
        })
        .refine(data => data.image !== undefined, {
          message: TENT_MOCKUP_VALIDATIONS.logoRequired
        })
        .describe('Logo for the company or organization'),
      fontColor: z
        .string()
        .describe('Color of the text to be displayed on the tent banner'),
      font: z
        .string()
        .describe('Font of the text to be displayed on the tent banner')
    })
    .describe('Details of the tent to be generated')
    .required()
})
