import { NextResponse } from 'next/server';
import type { SuccessResponse } from '@/types/api';

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
export async function GET() {
  try {
    const response: SuccessResponse<{ status: string }> = {
      status: 'success',
      success: true,
      message: 'Сервер работает нормально',
      timestamp: new Date().toISOString(),
      data: { status: 'ok' }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      success: false,
      message: 'Внутренняя ошибка сервера',
      timestamp: new Date().toISOString(),
      error: 'Internal Server Error',
      code: 500
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 