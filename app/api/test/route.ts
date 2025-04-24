import { createSuccessResponse } from '@/utils/api';
import { NextResponse } from 'next/server';

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
 */
export async function GET(): Promise<NextResponse> {
  return createSuccessResponse(
    { status: 'ok' },
    'Сервер работает нормально'
  ) as NextResponse;
} 