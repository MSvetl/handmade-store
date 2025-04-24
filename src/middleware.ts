import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { HTTP_STATUS } from '@/config/constants';

// Вспомогательная функция для создания ответа
function createResponse(body: any, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
}

export function middleware(request: NextRequest): Response {
  try {
    // Логируем входящий запрос
    logger.info(`Incoming request: ${request.method} ${request.url}`);

    // Добавляем базовые заголовки безопасности
    const headers = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    // Проверяем метод запроса
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      logger.warn(`Method not allowed: ${request.method}`);
      return createResponse(
        {
          status: 'error',
          message: 'Method not allowed',
          timestamp: new Date().toISOString(),
        },
        {
          status: HTTP_STATUS.BAD_REQUEST,
          headers,
        }
      );
    }

    // Продолжаем обработку запроса
    const response = new Response(null, { status: 200 });

    // Добавляем заголовки безопасности к ответу
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    logger.error('Middleware error:', error);
    return createResponse(
      {
        status: 'error',
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
}; 