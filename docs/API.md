# API Документация

## Общие принципы

### Формат ответа
Все API эндпоинты возвращают ответ в следующем формате:
```typescript
interface ApiResponse<T> {
  status: 'success' | 'error';
  success: boolean;
  message?: string;
  timestamp: string;
  data?: T;
  error?: string;
  code?: string;
}
```

### HTTP коды ответов
- 200 OK - Успешный запрос
- 400 Bad Request - Некорректный запрос
- 401 Unauthorized - Требуется авторизация
- 403 Forbidden - Доступ запрещен
- 404 Not Found - Ресурс не найден
- 500 Internal Server Error - Внутренняя ошибка сервера

### Заголовки безопасности
Каждый ответ содержит следующие заголовки безопасности:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Эндпоинты

### GET /api/test
Тестовый эндпоинт для проверки работоспособности API.

**Запрос:**
```
GET /api/test
```

**Успешный ответ:**
```json
{
  "status": "success",
  "success": true,
  "message": "Сервер работает нормально",
  "timestamp": "2024-04-24T11:25:01.830Z",
  "data": {
    "status": "ok"
  }
}
```

**Ошибка:**
```json
{
  "status": "error",
  "success": false,
  "message": "Internal Server Error",
  "timestamp": "2024-04-24T11:25:01.830Z",
  "error": "Описание ошибки"
}
```

## Обработка ошибок

### Классы ошибок

#### ApiError
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Middleware
Все запросы проходят через middleware, который:
1. Проверяет метод запроса
2. Добавляет заголовки безопасности
3. Обрабатывает ошибки
4. Логирует запросы

## Логирование
Все API запросы логируются с использованием встроенного логгера:
- Успешные запросы: уровень INFO
- Ошибки: уровень ERROR
- Отладочная информация: уровень DEBUG 