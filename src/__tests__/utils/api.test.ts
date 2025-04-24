import { createApiResponse, createSuccessResponse, createErrorResponse } from '@/utils/api';
import { HTTP_STATUS } from '@/config/constants';

describe('API Utils', () => {
  describe('createApiResponse', () => {
    it('should create success response with default message', () => {
      const data = { test: 'data' };
      const response = createApiResponse('success', data);

      expect(response.status).toBe('success');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Операция выполнена успешно');
      expect(response.data).toBe(data);
      expect(response.error).toBeUndefined();
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should create error response with default message', () => {
      const error = 'Test error';
      const response = createApiResponse('error', undefined, error);

      expect(response.status).toBe('error');
      expect(response.success).toBe(false);
      expect(response.message).toBe('Произошла ошибка');
      expect(response.data).toBeUndefined();
      expect(response.error).toBe(error);
      expect(response.timestamp).toBeDefined();
    });

    it('should create response with custom message', () => {
      const message = 'Custom message';
      const response = createApiResponse('success', null, undefined, message);

      expect(response.message).toBe(message);
    });
  });

  describe('createSuccessResponse', () => {
    it('should create success response with data', () => {
      const data = { test: 'data' };
      const response = createSuccessResponse(data);

      expect(response.status).toBe('success');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Операция выполнена успешно');
      expect(response.data).toBe(data);
      expect(response.error).toBeUndefined();
    });

    it('should create success response with custom message', () => {
      const data = { test: 'data' };
      const message = 'Custom success';
      const response = createSuccessResponse(data, message);

      expect(response.message).toBe(message);
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response with default status code', () => {
      const error = 'Test error';
      const response = createErrorResponse(error);

      expect(response.status).toBe('error');
      expect(response.success).toBe(false);
      expect(response.message).toBe('Произошла ошибка');
      expect(response.error).toBe(error);
    });

    it('should create error response with custom message and status code', () => {
      const error = 'Not found';
      const message = 'Resource not found';
      const statusCode = HTTP_STATUS.NOT_FOUND;
      const response = createErrorResponse(error, message, statusCode);

      expect(response.message).toBe(message);
      expect(response.error).toBe(error);
    });
  });
}); 