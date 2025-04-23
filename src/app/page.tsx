'use client';

import React, { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Тестовый запрос' }),
      });
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Произошла ошибка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Тестовая страница</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить запрос'}
          </button>
        </form>

        {response && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Ответ сервера:</h2>
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        )}
      </div>
    </main>
  );
} 