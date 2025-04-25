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
export const PHONE_REGEX = /^\(?\d{0,3}\)? ?\d{0,3}?-?\d{0,4}$/

export const TENT_MOCKUP_VALIDATIONS = {
  logoRequired: 'Logo is required'
}

export const COLORS = {
  WHITE_COLOR: '#ffffff',
  BLACK_COLOR: '#000000',
  LIGHT_GREY_COLOR: '#f5f5f5'
}

export const MOCKUP_TYPES = {
  'front-wall': 'Front Wall',
  'half-wall': 'Half Wall',
  'top-view': 'Top View',
  'no-walls': 'No Walls',
  table: 'Table'
}

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
        filename: 'No Walls View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_NO_WALLS_VIEW ?? ''
      },
      {
        filename: 'Top View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_TOP_VIEW ?? ''
      },
      {
        filename: 'Front View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_FRONT_VIEW ?? ''
      },
      {
        filename: 'Side View',
        url: process.env.NEXT_PUBLIC_LIGHT_CANOPY_SIDE_VIEW ?? ''
      }
    ],
    table: [
      { filename: 'Table', url: process.env.NEXT_PUBLIC_LIGHT_TABLE ?? '' }
    ]
  }
}

export const COLOR_SWATCHES = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#D50032' },
  { name: 'Pink', hex: '#E31C79' },
  { name: 'Purple', hex: '#582C83' },
  { name: 'Navy Blue', hex: '#00205B' },
  { name: 'Sky Blue', hex: '#41B6E6' },
  { name: 'Lime Green', hex: '#97D700' },
  { name: 'Brown', hex: '#4E3629' },
  { name: 'Dark Green', hex: '#154734' },
  { name: 'Reflex Blue', hex: '#001489' },
  { name: 'Yellow', hex: '#FEDD00' },
  { name: 'Black', hex: '#2D2926' }
]

export const HEX_REGEX = /^#([0-9A-Fa-f]{6})$/
