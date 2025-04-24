'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { API_ENDPOINTS, APP_CONFIG } from '@/config/constants';
import type { ApiResponse } from '@/types/api';

export default function Home(): JSX.Element {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testServerConnection = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchApi<ApiResponse>(API_ENDPOINTS.TEST);
      setResponse(data);
      logger.info('Server connection test successful', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      logger.error('Server connection test failed', err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-2xl font-bold mb-4">Тестовая страница</h1>
      <button
        onClick={testServerConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        style={{ backgroundColor: loading ? undefined : APP_CONFIG.THEME.PRIMARY_COLOR }}
      >
        {loading ? 'Загрузка...' : 'Проверить соединение с сервером'}
      </button>
      
      {error && (
        <div 
          className="mt-4 p-4 rounded"
          style={{ 
            backgroundColor: `${APP_CONFIG.THEME.ERROR_COLOR}20`,
            color: APP_CONFIG.THEME.ERROR_COLOR 
          }}
        >
          {error}
        </div>
      )}
      
      {response && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-w-full">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </main>
  );
} 