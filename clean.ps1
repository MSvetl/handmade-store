# Остановка процессов на порту из .env
$envContent = Get-Content .env
$port = ($envContent | Select-String "PORT=(\d+)").Matches.Groups[1].Value
Write-Host "Освобождаем порт $port..."
npx kill-port $port

# Удаление папок и очистка кэша
Write-Host "Удаляем .next и node_modules..."
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Очищаем кэш npm..."
npm cache clean --force

Write-Host "Устанавливаем зависимости заново..."
npm install

Write-Host "Очистка завершена успешно!" 