# Next.js Project Configuration Guide

Этот репозиторий содержит рабочую конфигурацию Next.js 14+ проекта с TypeScript и Tailwind CSS. 
Ветка `dev-2304` содержит проверенную конфигурацию, которая решает распространенные проблемы с подключением и запуском.

## 🚀 Быстрый старт

1. Клонируйте репозиторий или скопируйте конфигурационные файлы:
   ```bash
   git clone -b dev-2304 https://github.com/MSvetl/handmade-store.git
   ```

2. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

4. Запустите проект:
   ```bash
   npm run dev
   ```

## 📁 Ключевые файлы конфигурации

### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true
}
```
> ⚠️ Важно: В Next.js 14+ не нужно указывать `experimental.appDir`

### .env
```env
PORT=3001
```

### package.json (скрипты)
```json
{
  "scripts": {
    "dev": "npm run kill-port && next dev -p $PORT",
    "kill-port": "npx kill-port $PORT",
    "start": "next start -p $PORT",
    "clean": "rm -rf .next node_modules && npm cache clean --force && npm install"
  }
}
```

## 🔧 Решение проблем

### ERR_CONNECTION_REFUSED

Если возникает ошибка `ERR_CONNECTION_REFUSED` при запуске проекта:

1. Используйте PowerShell скрипт для автоматической очистки:
   ```powershell
   .\clean.ps1
   ```

   Или выполните команды вручную:
   ```bash
   # Остановить процессы на порту
   npx kill-port 3001
   
   # Удалить кэш и зависимости
   rm -rf .next node_modules
   npm cache clean --force
   
   # Переустановить зависимости
   npm install
   ```

2. Перезапустите сервер разработки:
   ```bash
   npm run dev
   ```

### Автоматическая очистка проекта

В проекте есть два способа очистки:

1. Через npm скрипт:
   ```bash
   npm run clean
   ```

2. Через PowerShell скрипт:
   ```powershell
   .\clean.ps1
   ```

## 📝 Перенос конфигурации в новый проект

1. Скопируйте следующие файлы:
   - `next.config.js`
   - `.env.example` → `.env`
   - `clean.ps1`
   - Скрипты из `package.json`

2. Обновите зависимости в `package.json`:
   ```json
   {
     "dependencies": {
       "next": "14.1.0",
       "react": "18.2.0",
       "react-dom": "18.2.0"
     },
     "devDependencies": {
       "kill-port": "^2.0.1"
     }
   }
   ```

3. Добавьте `.env` в `.gitignore`

## 🛠 Технический стек

- Next.js 14.1.0
- React 18.2.0
- TypeScript
- Tailwind CSS

## 📚 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## 🤝 Поддержка

Если у вас возникли проблемы или вопросы:
1. Проверьте раздел "Решение проблем" выше
2. Посмотрите [исходный код в ветке dev-2304](https://github.com/MSvetl/handmade-store/tree/dev-2304)
3. Создайте Issue в репозитории 