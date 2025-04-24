import { APP_CONFIG } from '@/config/constants';
import { logger } from './logger';
import type { ErrorResponse } from '@/types/api';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = APP_CONFIG.API_TIMEOUT, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      const error = data as ErrorResponse;
      throw new ApiError(
        response.status,
        error.message || 'Неизвестная ошибка',
        error
      );
    }

    logger.debug(`API call successful: ${endpoint}`, data);
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Превышено время ожидания запроса');
      }
      logger.error(`API call failed: ${endpoint}`, error);
      throw new ApiError(500, error.message);
    }

    throw new ApiError(500, 'Неизвестная ошибка');
  }
} 