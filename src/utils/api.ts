import { HTTP_STATUS } from '@/config/constants';
import { ApiResponse } from '@/types/api';

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
  error?: string,
  message: string = status === 'success' ? 'Операция выполнена успешно' : 'Произошла ошибка'
): ApiResponse<T> {
  return {
    status,
    success: status === 'success',
    timestamp: new Date().toISOString(),
    message,
    data,
    error
  };
}

/**
 * Создает успешный ответ API
 * @param data Данные для включения в ответ
 * @param message Сообщение пользователю (опционально)
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Операция выполнена успешно'
): ApiResponse<T> {
  return createApiResponse('success', data, undefined, message);
}

/**
 * Создает ответ с ошибкой
 * @param error Сообщение об ошибке
 * @param message Сообщение пользователю (опционально)
 * @param statusCode HTTP код статуса (по умолчанию 500)
 */
export function createErrorResponse(
  error: string,
  message: string = 'Произошла ошибка',
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): ApiResponse<undefined> {
  return createApiResponse('error', undefined, error, message);
} 