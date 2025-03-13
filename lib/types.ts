import { PutBlobResult } from '@vercel/blob'
import { CoreMessage, ImagePart } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface ClientMessage {
  id: string
  role: Roles
  display: React.ReactNode
  selectedOption?: string
}

export interface ToolCallResult {
  message: string
  props: any
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  messages: CoreMessage[]
  userId?: string
  path: string
  createdAt: Date
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
  file: File
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
  id: string
  companyName: string
  isPatterned: boolean
  tentColors: TentColorRegions
  text: string
  logo: ImagePart
  font: string
  fontColor: string
}

export type ChatResponse = Chat | null | { error: string }

export enum Roles {
  'user' = 'user',
  'assistant' = 'assistant',
  'system' = 'system',
  'tool' = 'tool'
}

export type TentColorConfig = {
  patterned: boolean
  isMonochrome: boolean
  awaitingColorPick: boolean
  currentRegion: string
  awaitingFileUpload: boolean
}

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export type MockupResponse = {
  front: PutBlobResult
  'half-wall': PutBlobResult
  'top-view': PutBlobResult
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
