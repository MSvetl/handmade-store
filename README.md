# Handmade Store

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/Tests-40%20passed-green)](docs/TESTING.md)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Веб-приложение для продажи рукодельных товаров, построенное с использованием современного стека технологий:
- 🚀 Next.js 14 с App Router
- 💎 TypeScript для надежной типизации
- 🎨 Tailwind CSS для стилизации
- ✅ Jest и React Testing Library для тестирования
- 📝 ESLint и Prettier для качества кода

## Возможности
- ⚡️ Быстрый и отзывчивый интерфейс
- 🔒 Встроенная защита от XSS и других уязвимостей
- 📱 Адаптивный дизайн
- 🧪 100% покрытие тестами
- 📖 Подробная документация

## Документация

- [📑 Общее описание проекта](docs/PROJECT.md)
- [🔌 API документация](docs/API.md)
- [💻 Руководство по разработке](docs/DEVELOPMENT.md)
- [🧪 Руководство по тестированию](docs/TESTING.md)

## Быстрый старт

### Предварительные требования
- Node.js 18.17 или выше
- npm 9.x или выше

### Установка и запуск
```bash
# Клонирование репозитория
git clone https://github.com/MSvetl/handmade-store.git
cd handmade-store

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:3001](http://localhost:3001)

## Основные команды

```bash
# Разработка
npm run dev        # Запуск сервера разработки на порту 3001

# Сборка
npm run build     # Создание production-сборки
npm start         # Запуск production-версии

# Тестирование
npm test         # Запуск всех тестов
npm run test:watch   # Запуск тестов в режиме наблюдения
npm run test:coverage # Проверка покрытия кода тестами

# Качество кода
npm run lint     # Проверка ESLint
npm run format   # Форматирование кода
npm run type-check # Проверка типов TypeScript
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

## Вклад в проект

Мы приветствуем ваш вклад в проект! Пожалуйста, ознакомьтесь с [руководством по разработке](docs/DEVELOPMENT.md) перед началом работы.

## Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE). 