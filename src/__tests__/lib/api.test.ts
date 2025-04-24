import { fetchApi, ApiError } from '@/lib/api';
import { logger } from '@/lib/logger';

// Мокаем логгер
jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe('API Utils', () => {
  let originalFetch: typeof global.fetch;
  
  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchApi', () => {
    it('should make successful API call', async () => {
      const mockData = { success: true, data: { test: 'data' } };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchApi('/test');

      expect(result).toEqual(mockData);
      expect(logger.debug).toHaveBeenCalledWith(
        'API call successful: /test',
        mockData
      );
    });

    it('should handle API error response', async () => {
      const errorResponse = {
        status: 'error',
        message: 'Test error',
        code: 400,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(fetchApi('/test')).rejects.toThrow(ApiError);
      await expect(fetchApi('/test')).rejects.toMatchObject({
        status: 400,
        message: 'Test error',
      });
    });

    it('should handle timeout', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      
      global.fetch = jest.fn().mockRejectedValue(abortError);

      await expect(fetchApi('/test')).rejects.toThrow('Превышено время ожидания запроса');
      await expect(fetchApi('/test')).rejects.toMatchObject({
        status: 408,
      });
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network error');
      global.fetch = jest.fn().mockRejectedValue(networkError);

      await expect(fetchApi('/test')).rejects.toThrow(ApiError);
      expect(logger.error).toHaveBeenCalledWith(
        'API call failed: /test',
        networkError
      );
    });

    it('should handle unknown error', async () => {
      global.fetch = jest.fn().mockRejectedValue('Unknown error');

      await expect(fetchApi('/test')).rejects.toThrow('Неизвестная ошибка');
      await expect(fetchApi('/test')).rejects.toMatchObject({
        status: 500,
      });
    });

    it('should set default headers', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/test');

      expect(fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
    });

    it('should merge custom headers', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await fetchApi('/test', {
        headers: {
          'Authorization': 'Bearer token',
        },
      });

      expect(fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        }),
      }));
    });
  });

  describe('ApiError', () => {
    it('should create ApiError instance', () => {
      const error = new ApiError(404, 'Not found', { details: 'test' });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.name).toBe('ApiError');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.data).toEqual({ details: 'test' });
    });
  });
}); 