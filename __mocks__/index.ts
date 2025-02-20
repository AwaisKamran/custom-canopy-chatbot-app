import { auth } from '@/auth'
import { getMessageFromCode } from '@/lib/utils'
import { put, PutBlobResult } from '@vercel/blob'
import { kv } from '@vercel/kv'
import { toast } from 'sonner'

/**
 * Mocked `auth` function.
 */
export const mockAuth = auth as jest.MockedFunction<typeof auth>

/**
 * Set up the `auth` mock to resolve with a user or null.
 * @param userId - The user ID to mock, or `null` for unauthenticated users.
 */
export const setupAuthMock = (userId: string | null) => {
  mockAuth.mockResolvedValue(userId ? { user: { id: userId } } : null)
}

/**
 * Mocked `put` function from `@vercel/blob`.
 */
export const mockPut = put as jest.MockedFunction<typeof put>

/**
 * Set up the `put` mock to resolve with a successful blob result.
 * @param response - The mocked successful response.
 */
export const setupBlobMock = (response: PutBlobResult) => {
  mockPut.mockResolvedValue(response)
}

/**
 * Set up the `put` mock to reject with an error.
 * @param error - The mocked error to be thrown.
 */
export const setupBlobErrorMock = (error: Error) => {
  mockPut.mockRejectedValue(error)
}

/**
 * Mocked `toast` functions from `sonner`.
 */
export const mockToastError = toast.error as jest.Mock
export const mockToastSuccess = toast.success as jest.Mock

/**
 * Mocked `getMessageFromCode` function from `@/lib/utils`.
 */
export const mockGetMessage = getMessageFromCode as jest.Mock

/**
 * Mocked `router` object from `next/navigation`.
 */
export const mockRouter = { push: jest.fn(), refresh: jest.fn() }

/**
 * Mocked `scrollIntoView` function for `HTMLElement`.
 */
export const mockScrollIntoView = jest.fn()

/**
 * Mocked `IntersectionObserver` constructor.
 */
export const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
})

/**
 * Mocked `kv` object from `@vercel/kv`.
 */
export const mockKv = kv as unknown as {
  zrange: jest.Mock
  pipeline: jest.Mock
  hgetall: jest.Mock
  hget: jest.Mock
  del: jest.Mock
  zrem: jest.Mock
}
