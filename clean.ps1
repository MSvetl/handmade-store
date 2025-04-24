# WARNING: Development only!
Write-Host "WARNING: This script is for local development only!" -ForegroundColor Yellow

# Load environment variables
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value)
        }
    }
}

# Get port
$port = if ($env:PORT) { $env:PORT } else { "3001" }
Write-Host "Cleaning port $port..." -ForegroundColor Cyan
npx kill-port $port

# Clean directories and cache
Write-Host "Removing .next and node_modules..."
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Cleaning npm cache..."
npm cache clean --force

Write-Host "Installing dependencies..."
npm install

Write-Host "Done! Run 'npm run dev' to start" -ForegroundColor Green 