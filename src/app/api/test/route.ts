import { createSuccessResponse } from '@/utils/api';

/**
 * GET-обработчик для тестового API эндпоинта
 * 
 * Этот эндпоинт используется для проверки работоспособности сервера.
 * Возвращает объект с текущим статусом и временной меткой.
 * 
 * @returns {Promise<Response>} Ответ с JSON-объектом, содержащим:
 * - status: 'success' | 'error'
 * - message: текстовое сообщение
 * - timestamp: временная метка в формате ISO
 * 
 * @throws {Error} В случае внутренней ошибки сервера возвращает 
 * ответ с кодом 500 и соответствующим сообщением об ошибке
 * 
 * @example
 * // Успешный ответ
 * {
 *   "status": "success",
 *   "message": "Сервер работает нормально",
 *   "timestamp": "2024-04-24T10:00:00.000Z"
 * }
 * 
 * // Ответ с ошибкой
 * {
 *   "status": "error",
 *   "message": "Внутренняя ошибка сервера",
 *   "timestamp": "2024-04-24T10:00:00.000Z",
 *   "code": 500
 * }
 */
export async function GET(): Promise<Response> {
  return createSuccessResponse(
    { status: 'ok' },
    'Сервер работает нормально'
  );
} 