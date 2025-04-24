import { HTTP_STATUS } from '@/config/constants';
import type { ApiResponse } from '@/types/api';

/**
 * Создает стандартизированный ответ API с унифицированной структурой
 * 
 * @param status Статус ответа:
 *   - 'success' - для успешных операций
 *   - 'error' - для ошибок
 * @param data Полезная нагрузка ответа (опционально)
 * @param error Объект ошибки или null (опционально)
 * @param message Пользовательское сообщение (опционально)
 * 
 * @returns {Response} Объект Response с JSON-телом, содержащим:
 *   - status: текущий статус
 *   - success: булево значение успеха
 *   - message: сообщение о результате
 *   - timestamp: время ответа
 *   - data?: переданные данные (если есть)
 *   - error?: сообщение об ошибке (если есть)
 *   - code?: код ошибки (для ApiError)
 * 
 * @example
 * // Успешный ответ с данными
 * createApiResponse('success', { id: 1, name: 'Item' });
 * 
 * // Ответ с ошибкой
 * createApiResponse('error', undefined, new Error('Not found'));
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
 * Создает успешный ответ API с переданными данными
 * 
 * @param data Данные для включения в ответ
 * @param message Опциональное сообщение пользователю
 * 
 * @returns {Response} Объект Response со статусом 200 и JSON-телом
 * 
 * @example
 * // Простой успешный ответ
 * createSuccessResponse({ items: [] });
 * 
 * // Успешный ответ с сообщением
 * createSuccessResponse({ user: { id: 1 } }, 'Пользователь успешно создан');
 */
export function createSuccessResponse<T>(data: T, message?: string): Response {
  return createApiResponse('success', data, undefined, message);
}

/**
 * Создает ответ API с информацией об ошибке
 * 
 * @param error Ошибка (объект Error или строка)
 * @param message Опциональное сообщение пользователю
 * 
 * @returns {Response} Объект Response со статусом 500 и JSON-телом
 * 
 * @example
 * // Ответ с строковой ошибкой
 * createErrorResponse('Неверные данные');
 * 
 * // Ответ с объектом ошибки и сообщением
 * createErrorResponse(new ApiError('Не найдено', 'NOT_FOUND'), 'Ресурс не существует');
 */
export function createErrorResponse(error: Error | string, message?: string): Response {
  const err = typeof error === 'string' ? new Error(error) : error;
  return createApiResponse('error', undefined, err, message);
}

/**
 * Расширенный класс Error для API-специфичных ошибок
 * Позволяет добавлять код ошибки для более точной обработки на клиенте
 * 
 * @extends Error
 * 
 * @example
 * // Создание специфичной ошибки API
 * throw new ApiError('Доступ запрещен', 'FORBIDDEN_ACCESS');
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 