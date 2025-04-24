/**
 * Базовый интерфейс для всех API ответов
 * 
 * @property {('success' | 'error')} status - Статус ответа
 * @property {string} message - Сообщение для пользователя
 * @property {string} timestamp - Временная метка в формате ISO
 */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Интерфейс для ответа с ошибкой
 * Расширяет базовый интерфейс, добавляя код ошибки
 * 
 * @extends {ApiResponse}
 * @property {number} code - HTTP код ошибки
 */
export interface ErrorResponse extends ApiResponse {
  status: 'error';
  success: false;
  error: string;
  code?: string;
}

/**
 * Интерфейс для успешного ответа
 * Расширяет базовый интерфейс, добавляя опциональные данные
 * 
 * @extends {ApiResponse}
 * @property {unknown} [data] - Опциональные данные ответа
 */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  status: 'success';
  success: true;
  data: T;
} 