'use client';

import { useState } from 'react';
import Button from './components/Button';

/**
 * Главная страница приложения
 * 
 * Компонент отображает тестовую страницу с кнопкой для проверки
 * соединения с сервером. При нажатии на кнопку отправляется запрос
 * к API эндпоинту и отображается результат.
 * 
 * Состояния страницы:
 * - Начальное: только кнопка
 * - Загрузка: отображается индикатор загрузки
 * - Успех: отображается сообщение от сервера
 * - Ошибка: отображается сообщение об ошибке
 * 
 * @component
 */
export default function Home(): React.ReactElement {
  // Состояние для хранения ответа от сервера
  const [response, setResponse] = useState<string | null>(null);
  // Состояние для отображения загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Состояние для отображения ошибки
  const [error, setError] = useState<string | null>(null);

  /**
   * Обработчик клика по кнопке
   * Отправляет запрос к тестовому API эндпоинту
   */
  const handleTestClick = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/test');
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError('Произошла ошибка при запросе к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-2xl font-bold mb-4">Тестовая страница</h1>
      
      <Button 
        onClick={handleTestClick}
        disabled={isLoading}
      >
        Проверить соединение с сервером
      </Button>

      {isLoading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {response && (
        <pre className="bg-gray-100 p-4 rounded-lg">
          {response}
        </pre>
      )}
    </main>
  );
} 