import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { HTTP_STATUS } from '@/config/constants';

export function middleware(request: NextRequest): NextResponse {
  try {
    // Логируем входящий запрос
    logger.info(`Incoming request: ${request.method} ${request.url}`);

    // Добавляем базовые заголовки безопасности
    const headers = new Headers({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });

    // Проверяем метод запроса
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      logger.warn(`Method not allowed: ${request.method}`);
      return new NextResponse(null, {
        status: HTTP_STATUS.BAD_REQUEST,
        statusText: 'Method not allowed',
        headers,
      });
    }

    // Продолжаем обработку запроса
    const response = NextResponse.next();

    // Добавляем заголовки безопасности к ответу
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    logger.error('Middleware error:', error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
}; 