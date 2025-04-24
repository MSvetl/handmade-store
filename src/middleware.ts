/**
 * Middleware для обработки API запросов
 * 
 * Этот файл содержит middleware-функцию, которая обрабатывает все запросы к API.
 * Основные задачи:
 * 1. Проверка и валидация HTTP методов
 * 2. Добавление заголовков безопасности
 * 3. Логирование запросов
 * 4. Обработка ошибок
 */

import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { HTTP_STATUS } from '@/config/constants';
import type { ApiResponse } from '@/types/api';

/**
 * Вспомогательная функция для создания стандартизированного ответа API
 * 
 * @param body - Тело ответа, соответствующее интерфейсу ApiResponse
 * @param init - Дополнительные параметры ответа (статус, заголовки и т.д.)
 * @returns Response - Объект ответа с правильными заголовками
 */
function createResponse(body: ApiResponse<unknown>, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
}

/**
 * Основная функция middleware
 * 
 * Обрабатывает все входящие запросы к API эндпоинтам.
 * Применяется только к путям, начинающимся с /api/ (см. конфигурацию matcher ниже)
 * 
 * @param request - Входящий запрос Next.js
 * @returns Response - Обработанный ответ с добавленными заголовками безопасности
 */
export function middleware(request: NextRequest): Response {
  try {
    // Логируем информацию о входящем запросе для отладки
    logger.info(`Incoming request: ${request.method} ${request.url}`);

    // Устанавливаем стандартные заголовки безопасности
    // X-Frame-Options: защита от clickjacking
    // X-Content-Type-Options: защита от MIME-sniffing
    // Referrer-Policy: контроль передачи referrer
    // Permissions-Policy: ограничение доступа к API браузера
    const headers = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    // Проверяем, является ли метод запроса допустимым
    // Разрешены только стандартные HTTP методы: GET, POST, PUT, DELETE
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      logger.warn(`Method not allowed: ${request.method}`);
      return createResponse(
        {
          status: 'error',
          success: false,
          message: 'Method not allowed',
          timestamp: new Date().toISOString(),
        },
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers,
        }
      );
    }

    // Если метод допустим, создаем базовый ответ
    const response = new Response(null, { status: 200 });

    // Добавляем все заголовки безопасности к ответу
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    // Логируем ошибку и возвращаем стандартизированный ответ об ошибке
    logger.error('Middleware error:', error);
    return createResponse(
      {
        status: 'error',
        success: false,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    );
  }
}

/**
 * Конфигурация middleware
 * 
 * matcher указывает, что middleware должен применяться
 * только к путям, начинающимся с /api/
 */
export const config = {
  matcher: '/api/:path*',
}; 