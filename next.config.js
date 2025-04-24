/**
 * @type {import('next').NextConfig}
 * 
 * ВАЖНО: Для Next.js 14+ не нужно указывать experimental.appDir
 * App Router теперь является стабильной функцией
 * 
 * Если возникает ошибка ERR_CONNECTION_REFUSED:
 * 1. Удалить папки .next и node_modules
 * 2. Очистить кэш npm: npm cache clean --force
 * 3. Переустановить зависимости: npm install
 * 4. Перезапустить сервер: npm run dev
 * 
 * Ссылка на рабочую конфигурацию: 
 * https://github.com/MSvetl/handmade-store/tree/dev-2304
 */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig 