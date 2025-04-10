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
        filename: 'Front View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/dark/front-DnKuv1U8WUFyV7cwPpTFmNSaMWyNP7.png'
      },
      // {
      //   filename: 'No Walls View',
      //   url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/no-walls-labelled-dark-rr7cSQbPtKOml8DA32tLLMpi7rlhjV.png'
      // },
      {
        filename: 'Side View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/dark/half-walls-PLdoyKU7DHBOioX9JB6lIXOH5F7Zyh.png'
      },
      {
        filename: 'Top View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/dark/top-view-ORDGOIiq5KxKpT2dpjUWCC4QRaIQMF.png'
      }
    ],
    table: [
      {
        filename: 'Table',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/dark/table-OqtfnAmQIGUDiNHersEB2CNpCEoypu.png'
      }
    ]
  },
  light: {
    canopy: [
      {
        filename: 'Front View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/light/front-52JArz8sEDOyvSC7mmZkeK3Hq1cUFh.png'
      },
      // {
      //   filename: 'No Walls View',
      //   url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/light/half-walls-499r5GYDKNkTmlKd8rEGvTlAIVsLfS.png'
      // },
      {
        filename: 'Side View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/side-labelled-zBUEx9GMyq1rOp0MembizovFNwurbj.png'
      },
      {
        filename: 'Top View',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/light/top-view-cOYUspNcRtfFM35sZoTdGFXLEoSZQ1.png'
      }
    ],
    table: [
      {
        filename: 'Table',
        url: 'https://xyvvsdhvfprf3oqa.public.blob.vercel-storage.com/custom-canopy-server-static/templates/light/table-qXl2boQQaUmxI9EnOAm774E8HQAvE8.png'
      }
    ]
  }
}
