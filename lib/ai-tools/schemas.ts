import { TENT_MOCKUP_VALIDATIONS } from '@/app/constants'
import { z } from 'zod'

export const ButtonToolSchema = z.object({
  content: z.string().describe('Asking user to choose from the options'),
  isMultiSelect: z
    .boolean()
    .describe('Whether or not the options are multi-select'),
  options: z
    .array(
      z.object({
        name: z.string().describe('The name for the button'),
        value: z.string().describe('The value for the button'),
        selected: z
          .boolean()
          .describe('The selected state for the button')
          .default(false),
        edit: z
          .boolean()
          .describe('The edit state for the button')
          .default(false)
      })
    )
    .describe('The options to display')
    .nonempty()
})

export const ColorPickerToolSchema = z.object({
  content: z.string().describe('Asking user to select color')
})

export const ChatTextInputGroupSchema = z.object({
  content: z.string().describe('Asking user to input details'),
  inputFields: z
    .array(
      z.object({
        label: z.string().describe('The label for the input field'),
        value: z.string().describe('The value for the input field')
      })
    )
    .describe('The input fields to display')
    .nonempty()
})

export const ColorLabelPickerSetSchema = z.object({
  content: z.string().describe('Asking user to select multi color'),
  fieldColors: z
    .array(
      z.object({
        name: z.string().describe('The name for the color picker'),
        label: z.string().describe('The label for the color picker'),
        color: z.object({
          name: z.string().describe('The color name'),
          rgb: z.string().describe('The color value in rgb'),
          hex: z.string().describe('The color value in hex')
        })
      })
    )
    .describe('The color pickers to display')
    .nonempty()
})

export const RegionsColorsManagerSchema = z.object({
  content: z.string().describe('Asking user to select multi color'),
  regions: z
    .array(
      z.object({
        name: z.string().describe('The name for the button'),
        sides: z.array(
          z.object({
            name: z.string().describe('The name for the button'),
            label: z.string().describe('The value for the button'),
            color: z.object({
              name: z.string().describe('The name for the button'),
              rgb: z.string().describe('The color value in rgb'),
              hex: z.string().describe('The color value in hex')
            })
          })
        )
      })
    )
    .describe('The options to display')
    .nonempty()
})

export const CustomCanopyToolSchema = z.object({
  content: z
    .array(z.string())
    .describe(
      'The content to be displayed for the canopy tool while waiting, after the image and while displaying add-ons options.'
    )
    .length(3),
  selectorName: z
    .string()
    .describe('The name of the selector for the mockup changes'),
  options: z
    .array(
      z.object({
        name: z.string().describe('The name for the button'),
        value: z.string().describe('The value for the button'),
        selected: z
          .boolean()
          .describe('Whether the button is selected')
          .default(false),
        edit: z
          .boolean()
          .describe('The edit state for the button')
          .default(false)
      })
    )
    .describe('The options to display')
    .nonempty(),
  payload: z
    .object({
      companyName: z.string().describe('Name of the company or organization'),
      tentTypes: z.array(z.string()).describe('Types of Tent'),
      peaks: z
        .object({
          front: z.string().describe('Color of peak front'),
          back: z.string().describe('Color of peak back'),
          left: z.string().describe('Color of peak left'),
          right: z.string().describe('Color of peak right')
        })
        .describe('Colors of the peaks')
        .required(),
      valences: z
        .object({
          front: z.string().describe('Color of valence front'),
          back: z.string().describe('Color of valence back'),
          left: z.string().describe('Color of valence left'),
          right: z.string().describe('Color of valence right')
        })
        .describe('Colors of the valences')
        .required(),
      walls: z
        .object({
          left: z.string().describe('Color of wall left'),
          right: z.string().describe('Color of wall right'),
          back: z.string().describe('Color of wall back')
        })
        .describe('Colors of the valences')
        .required(),
      valencesTexts: z
        .object({
          front: z
            .string()
            .describe('Text to be displayed on the front of the tent banner'),
          back: z
            .string()
            .describe('Text to be displayed on the back of the tent banner'),
          left: z
            .string()
            .describe('Text to be displayed on the left of the tent banner'),
          right: z
            .string()
            .describe('Text to be displayed on the right of the tent banner')
        })
        .describe('Details of the text to be displayed on the tent banner')
        .required(),
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
        .describe('Font of the text to be displayed on the tent banner'),
      tableColor: z
        .string()
        .describe('Color of the table to be displayed on the tent banner')
    })
    .describe('Details of the tent to be generated')
    .required()
})

export const PlaceFinalOrderSchema = z.object({
  content: z
    .string()
    .describe(
      'Message to display when asking for user details before placing final order'
    )
})

export const ShowUserDetailsSchema = z.object({
  content: z
    .string()
    .describe(
      'Message to display when asking for user details before placing final order'
    )
})
