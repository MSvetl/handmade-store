# Руководство по тестированию

## Общие принципы

### Инструменты
- Jest - основной фреймворк тестирования
- React Testing Library - тестирование React компонентов
- jest-dom - дополнительные матчеры для DOM
- MSW (Mock Service Worker) - мокирование API

### Структура тестов
```
src/
├── __tests__/              # Тесты
│   ├── api/               # Тесты API
│   ├── components/        # Тесты компонентов
│   ├── lib/              # Тесты утилит
│   └── utils/            # Тесты вспомогательных функций
```

## Виды тестов

### Unit тесты
Тестирование отдельных функций и компонентов:
```typescript
describe('createApiResponse', () => {
  it('should create success response', () => {
    const response = createApiResponse('success', { data: 'test' });
    expect(response.success).toBe(true);
  });
});
```

### Интеграционные тесты
Тестирование взаимодействия компонентов:
```typescript
describe('API Integration', () => {
  it('should handle API errors', async () => {
    const response = await fetchApi('/api/test');
    expect(response.status).toBe(200);
  });
});
```

### Тесты компонентов
Тестирование React компонентов:
```typescript
describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Моки и стабы

### Мокирование модулей
```typescript
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
```

### Мокирование API
```typescript
const mockResponse = {
  status: 'success',
  data: { test: true },
};

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(mockResponse),
});
```

### Мокирование компонентов
```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

## Запуск тестов

### Команды
```bash
# Все тесты
npm test

# Конкретный файл
npm test path/to/test.ts

# С покрытием
npm test -- --coverage

# В watch режиме
npm test -- --watch
```

### Конфигурация Jest
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Покрытие кода

### Настройка
```javascript
{
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### Отчеты
- HTML отчет: `coverage/lcov-report/index.html`
- Консольный отчет
- Интеграция с CI/CD

## Лучшие практики

### Организация тестов
1. Группируйте связанные тесты
2. Используйте понятные описания
3. Следуйте паттерну AAA (Arrange-Act-Assert)

### Именование
- Файлы: `*.test.ts` или `*.spec.ts`
- Описания: понятные и информативные
- Переменные: осмысленные имена

### Изоляция
- Используйте `beforeEach` для настройки
- Очищайте моки после тестов
- Избегайте зависимости между тестами 