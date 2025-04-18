export const Error401Response = {
  status: 401,
  message: 'Unauthorized'
}

export const Error400Response = {
  status: 400,
  message: 'Bad Request'
}

export const Error500Response = {
  status: 500,
  message: 'Internal Server Error'
}

export const ErrorMessage = {
  message: 'error'
}

export const SuccessMessage = {
  message: 'success'
}

export type AccessType = 'public'

export const BlobAccess = {
  public: 'public' as AccessType
}

export const CHAT = 'chat'
export const IMAGE = 'image'
export const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/

export const TENT_MOCKUP_VALIDATIONS = {
  logoRequired: 'Logo is required'
}

export const COLORS = {
  WHITE_COLOR: '[255, 255, 255]',
  BLACK_COLOR: '[0, 0, 0]',
  LIGHT_GREY_COLOR: '[250, 250, 250]'
}

export const MOCKUP_TYPES = {
  'front-wall': 'Front Wall',
  'half-wall': 'Half Wall',
  'top-view': 'Top View',
  'no-walls': 'No Walls',
  table: 'Table'
}
export const DOWNLOAD_ZIP_NAME = 'images'

export const GUIDANCE_IMAGE_URLS = {
  dark: {
    canopy: [
      {
        filename: 'No Walls View',
        url: process.env.NEXT_PUBLIC_DARK_CANOPY_NO_WALLS_VIEW ?? ''
      },
      {
        filename: 'Top View',
        url: process.env.NEXT_PUBLIC_DARK_CANOPY_TOP_VIEW ?? ''
      },
      {
        filename: 'Front View',
        url: process.env.NEXT_PUBLIC_DARK_CANOPY_FRONT_VIEW ?? ''
      },
      {
        filename: 'Side View',
        url: process.env.NEXT_PUBLIC_DARK_CANOPY_SIDE_VIEW ?? ''
      }
    ],
    table: [
      { filename: 'Table', url: process.env.NEXT_PUBLIC_DARK_TABLE ?? '' }
    ]
  },
  light: {
    canopy: [
      {
        filename: 'Front View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_FRONT_VIEW ?? ''
      },
      {
        filename: 'No Walls View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_NO_WALLS_VIEW ?? ''
      },
      {
        filename: 'Side View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_SIDE_VIEW ?? ''
      },
      {
        filename: 'Top View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_TOP_VIEW ?? ''
      }
    ],
    table: [
      { filename: 'Table', url: process.env.NEXT_PUBLIC_LIGHT_TABLE ?? '' }
    ]
  }
}

export const COLOR_SWATCHES = [
  { name: 'White', rgb: '[255, 255, 255]', hex: '#FFFFFF' },
  { name: 'Red', rgb: '[213, 0, 50]', hex: '#D50032' },
  { name: 'Pink', rgb: '[227, 28, 121]', hex: '#E31C79' },
  { name: 'Purple', rgb: '[88, 44, 131]', hex: '#582C83' },
  { name: 'Navy Blue', rgb: '[0, 32, 91]', hex: '#00205B' },
  { name: 'Sky Blue', rgb: '[65, 182, 230]', hex: '#41B6E6' },
  { name: 'Lime Green', rgb: '[151, 215, 0]', hex: '#97D700' },
  { name: 'Brown', rgb: '[78, 54, 41]', hex: '#4E3629' },
  { name: 'Dark Green', rgb: '[21, 71, 52]', hex: '#154734' },
  { name: 'Reflex Blue', rgb: '[0, 20, 137]', hex: '#001489' },
  { name: 'Yellow', rgb: '[254, 221, 0]', hex: '#FEDD00' },
  { name: 'Black', rgb: '[45, 41, 38]', hex: '#2D2926' }
]

export const HEX_REGEX = /^#([0-9A-Fa-f]{6})$/
