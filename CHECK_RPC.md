# Как проверить, что RPC ключ используется

## Быстрая проверка

1. **Откройте консоль браузера** (F12 → Console)
2. **Попробуйте выполнить транзакцию** (Earn 1 Reputation)
3. **Найдите логи** с префиксом `📡 [RPC CHECK]`

## Что должно быть в логах

### ✅ Если RPC ключ работает:
```
📡 [RPC CHECK] Custom RPC: ✅ https://your-endpoint.base-sepolia.quiknode.pro/...
📡 [RPC CHECK] Will use: Custom RPC (with fallback)
```

### ❌ Если RPC ключ НЕ загружен:
```
📡 [RPC CHECK] Custom RPC: ❌ NOT SET
📡 [RPC CHECK] Will use: Public endpoints only
⚠️ [WARNING] No custom RPC set! Add NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL in Vercel
```

## Если видите "❌ NOT SET"

### Шаг 1: Проверьте Vercel
1. Откройте Vercel → Settings → Environment Variables
2. Найдите `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
3. Проверьте значение:
   - Должно быть: `https://your-endpoint.base-sepolia.quiknode.pro/YOUR_KEY/`
   - НЕ должно быть: `your-endpoint.base-sepolia.quiknode.pro/YOUR_KEY/` (без https://)

### Шаг 2: Передеплойте
1. Deployments → последний deployment → Redeploy
2. Дождитесь завершения деплоя

### Шаг 3: Перезагрузите страницу
1. Нажмите Ctrl+F5 (Windows) или Cmd+Shift+R (Mac)
2. Это очистит кеш и загрузит новые переменные

### Шаг 4: Проверьте снова
1. Откройте консоль (F12)
2. Попробуйте транзакцию
3. Проверьте логи

## Если видите "✅ Custom RPC", но ошибки остаются

### Возможные причины:

1. **RPC endpoint перегружен**
   - Решение: Подождите 5-10 минут и попробуйте снова

2. **Превышен лимит запросов**
   - Проверьте QuickNode Dashboard
   - Убедитесь, что не превышен free tier лимит

3. **RPC endpoint неактивен**
   - Проверьте QuickNode Dashboard
   - Убедитесь, что endpoint активен (Status: Active)

4. **Неправильная сеть**
   - Убедитесь, что endpoint для Base Sepolia, а не Base Mainnet
   - Проверьте в QuickNode Dashboard

5. **Неправильный формат URL**
   - URL должен быть полным: `https://...`
   - Должен заканчиваться на `/` или иметь API ключ в пути

## Альтернативное решение

Если QuickNode не работает, попробуйте:

1. **Создать новый endpoint на QuickNode**
   - Удалите старый
   - Создайте новый для Base Sepolia
   - Скопируйте новый URL

2. **Использовать другой провайдер**
   - Infura: https://infura.io/
   - Ankr: https://www.ankr.com/
   - Следуйте инструкциям в GET_RPC_KEY.md

## Проверка RPC endpoint напрямую

Откройте ваш RPC URL в браузере:
```
https://your-endpoint.base-sepolia.quiknode.pro/YOUR_KEY/
```

Должен вернуться JSON с ошибкой метода (это нормально), а не HTML страницу.

Если возвращается HTML - URL неправильный.

