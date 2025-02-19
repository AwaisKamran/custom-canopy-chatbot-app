import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface ChatMessage {
  id: string;
  message: string;
  role?: string;
  files?: string
}


export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId?: string
  path: string
  messages: ChatMessage[]
  sharePath?: string
  threadId: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export interface FileData {
  file: File,
  previewUrl: string
  name?: string
  fileType: string
}

export interface TentColorRegions {
    slope: string
    canopy: string
    walls_primary: string
    walls_secondary: string
    walls_tertiary: string
}

export interface TentMockUpPrompt {
  companyName: string
  isPatterned: boolean
  tentColors: TentColorRegions
  text: string
  logo: FileData | null
  font: string
  fontColor: string
}

export type RegionsType = 'slope' | 'canopy' | 'walls_primary' | 'walls_secondary' | 'walls_tertiary'


export enum Regions {
  slope = 'slope',
  canopy = 'canopy',
  walls_primary = 'walls_primary',
  walls_secondary = 'walls_secondary',
  walls_tertiary = 'walls_tertiary'
}

export type ChatResponse = Chat | null | { error: string }

export enum Roles {
  "user" = "user",
  "assistant" = "assistant"
}

export type TentColorConfig = {
  patterned: boolean,
  isMonochrome: boolean,
  awaitingColorPick: boolean,
  currentRegion: string,
  awaitingFileUpload: boolean
}

export enum StreamEvent {
  DELTA = 'thread.message.delta',
  REQUIRES_ACTION = 'thread.run.requires_action',
  COMPLETED = 'thread.message.completed',
  ERROR = 'error'
}

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export type ActionResult = {
  type: string
  resultCode: ResultCode
  errors?: ActionErrors
}

export type ActionErrors = {
  fieldErrors?: FieldErrors
  formErrors?: string[]
}

export type FieldErrors = {
  [x: string]: string | undefined
  [x: number]: string | undefined
  [x: symbol]: string | undefined
}
