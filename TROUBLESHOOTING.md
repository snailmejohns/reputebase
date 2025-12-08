# Troubleshooting Guide

## Проблема: API возвращает 404

### Симптомы:
- В консоли видно: `Response error: <!DOCTYPE html>... 404: This page could not be found`
- Ошибка "Failed to fetch reputation: API endpoint not found (404)"

### Решение:
1. **Проверьте переменную `NEXT_PUBLIC_API_URL` в Vercel:**
   - Settings → Environment Variables
   - Убедитесь, что значение правильное (например: `https://your-api.railway.app`)
   - **Важно:** URL должен быть без слеша в конце (`/`)

2. **Проверьте, что API работает:**
   - Откройте URL API в браузере: `https://your-api.railway.app/health`
   - Должен вернуться JSON, а не HTML страница

3. **Проверьте Railway:**
   - Убедитесь, что сервис запущен
   - Проверьте логи на Railway
   - Убедитесь, что публичный домен настроен

## Проблема: RPC endpoint returned too many errors

### Симптомы:
- `RPC endpoint returned too many errors, retrying in 0,5 minutes`
- `Requested resource not available`
- Транзакции не проходят

### Решение:

#### Вариант 1: Подождать и повторить
Публичные RPC endpoints могут быть временно перегружены. Подождите несколько минут и попробуйте снова.

#### Вариант 2: Использовать платный RPC (рекомендуется)
1. Получите бесплатный API ключ:
   - **QuickNode**: https://www.quicknode.com/ (проще всего, бесплатный tier)
   - **Alchemy**: https://www.alchemy.com/ (если доступно в вашем регионе)
   - **Infura**: https://infura.io/ (если доступно)

2. Добавьте в Vercel:
   ```
   NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://your-rpc-url
   ```

3. Передеплойте

#### Вариант 3: Проверить контракт
Убедитесь, что контракт существует на Base Sepolia:
- Откройте: https://sepolia.basescan.org/address/0x5d7683Ab887849543ae32287c26ac9da40423342
- Должен быть виден код контракта

## Проверка конфигурации

### Обязательные переменные в Vercel:
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_TX_VOLUME_MODULE_ADDRESS=0x5d7683Ab887849543ae32287c26ac9da40423342
```

### Опциональные (но рекомендуемые):
```
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://your-rpc-url
```

## Как проверить логи

1. Откройте консоль браузера (F12 → Console)
2. Ищите префиксы:
   - `🔍 [DEBUG]` - информация о попытке
   - `📝 [INFO]` - детали операции
   - `✅ [SUCCESS]` - успешные операции
   - `❌ [ERROR]` - ошибки
   - `⚠️ [WARN]` - предупреждения
   - `📡 [RPC]` - информация о RPC
   - `🔍 [API]` - информация об API

## Частые ошибки

### "API is not configured"
- Добавьте `NEXT_PUBLIC_API_URL` в Vercel
- Передеплойте проект

### "Wrong network"
- Переключитесь на Base Sepolia в кошельке
- Chain ID должен быть 84532

### "Contract not found"
- Проверьте адрес контракта на Basescan
- Убедитесь, что контракт задеплоен на Base Sepolia

