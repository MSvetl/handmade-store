# Handmade Store

Веб-приложение для продажи рукодельных товаров, построенное на Next.js 14, React и TypeScript.

## Документация

- [Общее описание проекта](docs/PROJECT.md)
- [API документация](docs/API.md)
- [Руководство по разработке](docs/DEVELOPMENT.md)
- [Руководство по тестированию](docs/TESTING.md)

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3001

## Основные команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск тестов
npm test

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

## Структура проекта

```
handmade-store/
├── app/                    # Next.js App Router
│   ├── api/               # API эндпоинты
│   ├── components/        # React компоненты
│   └── styles/           # Стили
├── src/                   # Исходный код
│   ├── lib/              # Библиотеки
│   ├── types/            # TypeScript типы
│   ├── utils/            # Утилиты
│   └── config/           # Конфигурации
├── docs/                 # Документация
├── public/               # Статические файлы
└── tests/                # Тесты
```

## Требования

- Node.js 18.17 или выше
- npm 9.x или выше

## Лицензия

MIT 