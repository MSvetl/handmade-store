import { HTTP_STATUS } from '@/config/constants';
import type { ApiResponse } from '@/types/api';

/**
 * Создает стандартизированный ответ API
 * @param status Статус ответа ('success' | 'error')
 * @param data Данные ответа
 * @param error Сообщение об ошибке (опционально)
 * @param message Сообщение пользователю (опционально)
 */
export function createApiResponse<T>(
  status: 'success' | 'error',
  data?: T,
  error?: Error | null,
  message?: string
): Response {
  const response: ApiResponse<T> = {
    status,
    success: status === 'success',
    message: message || (status === 'success' ? 'Success' : 'Error'),
    timestamp: new Date().toISOString(),
  };

  if (data) {
    response.data = data;
  }

  if (error) {
    response.error = error.message;
    if (error instanceof ApiError) {
      response.code = error.code;
    }
  }

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: status === 'success' ? HTTP_STATUS.OK : HTTP_STATUS.INTERNAL_SERVER_ERROR
  });
}

/**
 * Создает успешный ответ API
 * @param data Данные для включения в ответ
 * @param message Сообщение пользователю (опционально)
 */
export function createSuccessResponse<T>(data: T, message?: string): Response {
  return createApiResponse('success', data, undefined, message);
}

/**
 * Создает ответ с ошибкой
 * @param error Сообщение об ошибке
 * @param message Сообщение пользователю (опционально)
 * @param statusCode HTTP код статуса (по умолчанию 500)
 */
export function createErrorResponse(error: Error | string, message?: string): Response {
  const err = typeof error === 'string' ? new Error(error) : error;
  return createApiResponse('error', undefined, err, message);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 