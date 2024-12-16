import { CoreMessage } from 'ai'
import { ChatMessage } from './redux/slice/chat.slice'

export type Message = CoreMessage & {
  id: string
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

export type RegionsType = 'slope' | 'canopy' | 'walls_primary' | 'walls_secondary' | 'walls_tertiary'


export enum Regions {
  slope = 'slope',
  canopy = 'canopy',
  walls_primary = 'walls_primary',
  walls_secondary = 'walls_secondary',
  walls_tertiary = 'walls_tertiary'
}

export type ChatResponse = Chat | null | { error: string }