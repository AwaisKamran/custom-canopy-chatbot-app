import {
  getChats,
  getChat,
  removeChat,
  clearChats,
  saveChat,
  getMissingKeys,
} from '@/app/actions';
import { auth } from '@/auth';
import { del } from '@vercel/blob';
import {
  generateMockChat,
  generateMockChats,
} from "@/__mocks__/data/chat";
import { generateMockUser } from '@/__mocks__/data/user';
import { mockKv } from '@/__mocks__';

jest.mock('@vercel/kv', () => ({
  kv: {
    zrange: jest.fn(),
    pipeline: jest.fn(),
    hgetall: jest.fn(),
    hget: jest.fn(),
    del: jest.fn(),
    zrem: jest.fn()
  },
}));

jest.mock('@/auth');
jest.mock('@vercel/blob');


jest.mock('next/navigation');
jest.mock('next/cache')

const mockDel = del as jest.MockedFunction<typeof del>;

describe('Chat Service Tests', () => {
  const mockUser = generateMockUser();
  const mockChats = generateMockChats(mockUser.id);
  const mockChat = generateMockChat(mockUser.id);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChats', () => {
    it('should return chats for a valid user', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.zrange.mockResolvedValue(mockChats.map(chat => `chat:${chat.id}`));
      mockKv.pipeline = jest.fn().mockReturnValue({
        hgetall: jest.fn(),
        exec: jest.fn().mockResolvedValue(mockChats),
      });

      const chats = await getChats(mockUser.id);
      expect(chats).toEqual(mockChats);
    });

    it('should return an empty array if no userId is provided', async () => {
      const chats = await getChats(null);
      expect(chats).toEqual([]);
    });

    it('should return an error if the userId does not match the session user', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: 'anotherUserId' } });
      const chats = await getChats(mockUser.id);
      expect(chats).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('getChat', () => {
    it('should return a chat if the user is authorized', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.hgetall.mockResolvedValue(mockChat);

      const chat = await getChat(mockChat.id, mockUser.id);
      expect(chat).toEqual(mockChat);
    });

    it('should return null if the chat does not exist', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.hgetall.mockResolvedValue(null);

      const chat = await getChat(mockChat.id, mockUser.id);
      expect(chat).toBeNull();
    });

    it('should return an error if the user is unauthorized', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: 'anotherUserId' } });
      const chat = await getChat(mockChat.id, mockUser.id);
      expect(chat).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('removeChat', () => {
    it('should remove a chat if the user is authorized', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.hget.mockResolvedValue(mockUser.id);
      mockKv.del.mockResolvedValue(true);
      mockKv.zrem.mockResolvedValue(true);
      mockDel.mockResolvedValue();

      await removeChat({ id: mockChat.id, path: '/' });

      expect(mockKv.del).toHaveBeenCalledWith(`chat:${mockChat.id}`);
      expect(mockKv.zrem).toHaveBeenCalledWith(
        `user:chat:${mockUser.id}`,
        `chat:${mockChat.id}`
      );
    });

    it('should return an error if the user is unauthorized', async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const result = await removeChat({ id: mockChat.id, path: '/' });
      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('clearChats', () => {
    it('should clear all chats for a user', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.zrange.mockResolvedValue(mockChats.map(chat => `chat:${chat.id}`));
      mockKv.pipeline = jest.fn().mockReturnValue({
        del: jest.fn(),
        zrem: jest.fn(),
        exec: jest.fn().mockResolvedValue(true),
      });

      await clearChats();

      expect(mockKv.pipeline).toHaveBeenCalled();
    });

    it('should return an error if the user is unauthorized', async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const result = await clearChats();
      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('saveChat', () => {
    it('should save a chat for the authenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: mockUser.id } });
      mockKv.pipeline = jest.fn().mockReturnValue({
        hmset: jest.fn(),
        zadd: jest.fn(),
        exec: jest.fn().mockResolvedValue(true),
      });

      await saveChat(mockChat);

      expect(mockKv.pipeline).toHaveBeenCalled();
      expect(mockKv.pipeline().hmset).toHaveBeenCalledWith(
        `chat:${mockChat.id}`,
        mockChat
      );
    });
  });

  describe('getMissingKeys', () => {
    it('should return missing keys', async () => {
      const originalEnv = { ...process.env };
      process.env = {
        ...process.env,
        OPENAI_API_KEY: '',
        NEXT_PUBLIC_ASSISTANT_ID: 'mockValue',
        NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL: '',
      };

      const missingKeys = await getMissingKeys();
      expect(missingKeys).toEqual(['OPENAI_API_KEY', 'NEXT_PUBLIC_CUSTOM_CANOPY_SERVER_URL']);

      process.env = originalEnv;
    });
  });
});
