import { Regions } from "@/lib/types"

export const Error401Response = {
    "status": 401,
    "message": "Unauthorized"
}

export const Error400Response = {
    "status": 400,
    "message": "Bad Request"
}

export const Error500Response = {
    "status": 500,
    "message": "Internal Server Error"
}

export const ErrorMessage = {
    "message": "error"
}

export const SuccessMessage = {
    "message": "success"
}

export type AccessType = 'public'

export const BlobAccess = {
    public: 'public' as AccessType
}

export const CHAT = 'chat'
export const IMAGE = 'image'

export const TENT_MOCKUP_VALIDATIONS = {
  logoRequired: 'Logo is required',
}

export const COLORS = {
  WHITE_COLOR: '[255, 255, 255]',
  BLACK_COLOR: '[0, 0, 0]',
  LIGHT_GREY_COLOR: '[250, 250, 250]'
   
}

export const ASSISTANT_RESPONSE_CONFIG = [{
    conditions: ["slope"],
    excludes: ["text", "logo"],
    actions: {
      isMonochrome: false,
      currentRegion: Regions.slope
    },
  },
  {
    conditions: ["canopy"],
    excludes: ["custom", "text", "logo"],
    actions: {
      isMonochrome: false,
      currentRegion: Regions.canopy
    },
  },
  {
    conditions: ["walls", "color"],
    excludes: ["text", "logo"],
    actions: {
      isMonochrome: false,
      currentRegion: Regions.walls_primary
    },
  },
  {
    conditions: ["secondary", "color"],
    excludes: ["mockup", "just to confirm", "text", "logo"],
    actions: {
      patterned: true,
      awaitingColorPick: true,
      currentRegion: Regions.walls_secondary
    },
  },
  {
    conditions: ["tertiary", "color"],
    excludes: ["mockup", "just to confirm", "text", "logo"],
    actions: {
      patterned: true,
      awaitingColorPick: true,
      currentRegion: Regions.walls_tertiary
    },
  },
  {
    conditions: ["color"],
    excludes: ["slope", "canopy", "walls", "secondary", "tertiary"],
    actions: {
      isMonochrome: true,
      currentRegion: Regions.walls_primary
    },
  },
  {
    conditions: ['text'],
    actions: {
      awaitingColorPick: false
    },
  },
  {
    conditions: ["color"],
    excludes: ["logo", "text", "monochrome", "different regions", "mockup", "just to confirm"],
    actions: {
      awaitingColorPick: true
    },
  },
  {
    conditions: ["logo"],
    excludes: ["uploading", "color"],
    actions: {
      awaitingFileUpload: true
    },
  },
  {
    conditions: ["text", "logo", "color"],
    actions: {
      currentRegion: Regions.slope
    },
  },
];

export const INITIAL_CHAT_MESSAGE = "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let's get started! \n \n What is the name of your company or organization?"
