import { createApiResponse, createSuccessResponse, createErrorResponse } from '@/utils/api';
import { HTTP_STATUS } from '@/config/constants';
import type { ApiResponse, SuccessResponse, ErrorResponse } from '@/types/api';

// Мок для Response
class MockResponse {
  status: number;
  headers: Map<string, string>;
  body: any;

  constructor(body: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

// Мокаем глобальный Response перед тестами
beforeAll(() => {
  global.Response = MockResponse as any;
});

describe('API Utils', () => {
  describe('createApiResponse', () => {
    it('should create a successful response', async () => {
      const data = { test: 'data' };
      const response = createApiResponse('success', data);

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const json = await response.json() as SuccessResponse<typeof data>;
      expect(json.success).toBe(true);
      expect(json.message).toBe('Success');
      expect(json.data).toEqual(data);
      expect(json.error).toBeUndefined();
      expect(json.timestamp).toBeDefined();
      expect(new Date(json.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should create an error response', async () => {
      const error = new Error('Test error');
      const response = createApiResponse('error', undefined, error);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const json = await response.json() as ErrorResponse;
      expect(json.success).toBe(false);
      expect(json.message).toBe('Error');
      expect(json.data).toBeUndefined();
      expect(json.error).toBe(error.message);
      expect(json.timestamp).toBeDefined();
    });

    it('should use custom message', async () => {
      const message = 'Custom message';
      const response = createApiResponse('success', undefined, null, message);

      const json = await response.json() as ApiResponse;
      expect(json.message).toBe(message);
    });
  });

  describe('createSuccessResponse', () => {
    it('should create a successful response with data', async () => {
      const data = { test: 'data' };
      const response = createSuccessResponse(data);

      expect(response.status).toBe(HTTP_STATUS.OK);
      const json = await response.json() as SuccessResponse<typeof data>;
      expect(json.success).toBe(true);
      expect(json.message).toBe('Success');
      expect(json.data).toEqual(data);
      expect(json.error).toBeUndefined();
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with string error', async () => {
      const error = 'Test error';
      const response = createErrorResponse(error);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      const json = await response.json() as ErrorResponse;
      expect(json.success).toBe(false);
      expect(json.message).toBe('Error');
      expect(json.error).toBe(error);
    });

    it('should create an error response with Error object and custom message', async () => {
      const error = new Error('Test error');
      const message = 'Custom error message';
      const response = createErrorResponse(error, message);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      const json = await response.json() as ErrorResponse;
      expect(json.message).toBe(message);
      expect(json.error).toBe(error.message);
    });
  });
}); 