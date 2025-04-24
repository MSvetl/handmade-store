'use client';

import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testServerConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test');
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Ошибка соединения с сервером');
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
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Загрузка...' : 'Проверить соединение с сервером'}
      </button>
      {response && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {response}
        </pre>
      )}
    </main>
  );
} 