import { NextRequest } from 'next/server';
import { POST } from '@/app/api/save-files/route';
import {
  Error400Response,
  Error401Response,
  Error500Response,
} from '@/app/constants';
import { generateMockSaveFileData } from '@/__mocks__/data/saveFileData';
import { mockPut, setupAuthMock, setupBlobErrorMock, setupBlobMock } from '@/__mocks__';

jest.mock('@/auth')
jest.mock('@vercel/blob')
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn(data => ({
      data
    }))
  }
}))

describe('POST Handler Tests', () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (
    params: Record<string, string>,
    body: any = null
  ): Partial<NextRequest> => {
    const url = new URL(`https://example.com/api?${new URLSearchParams(params)}`);
    return { url: url.toString(), body } as Partial<NextRequest>;
  };

  it('should return 200 with a blob object for valid input', async () => {
    const { userId, chatId, filename, file, blobMockResponse } =
      generateMockSaveFileData();

    setupAuthMock(userId);
    setupBlobMock(blobMockResponse);
    mockRequest = createMockRequest({ chatId, filename, userId }, file);

    const response = await POST(mockRequest as NextRequest);

    expect(response).toEqual({ data: blobMockResponse });
  });

  it('should return 401 if user is not authenticated', async () => {
    const { userId, chatId, filename, file } = generateMockSaveFileData();

    setupAuthMock(null);
    mockRequest = createMockRequest({ chatId, filename, userId }, file);

    const response = await POST(mockRequest as NextRequest);

    expect(response).toEqual({
      data: { status: Error401Response.status, error: Error401Response.message },
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('should return 400 if input is invalid', async () => {
    const { userId, chatId, filename } = generateMockSaveFileData();

    setupAuthMock(userId);
    mockRequest = createMockRequest({ chatId, filename, userId }, null);

    const response = await POST(mockRequest as NextRequest);

    expect(response).toEqual({
      data: { status: Error400Response.status, error: Error400Response.message },
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    const { userId, chatId, filename, file } = generateMockSaveFileData();
    const mockError = new Error('Something went wrong');

    setupAuthMock(userId);
    setupBlobErrorMock(mockError);
    mockRequest = createMockRequest({ chatId, filename, userId }, file);

    const response = await POST(mockRequest as NextRequest);

    expect(response).toEqual({
      data: { status: Error500Response.status, error: mockError },
    });
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
});
