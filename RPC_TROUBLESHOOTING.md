# RPC Troubleshooting Guide

## Проблема: RPC все еще не работает после добавления ключа

### Шаг 1: Проверьте, что RPC ключ используется

1. **Откройте консоль браузера** (F12 → Console)
2. **Найдите логи** с префиксом `📡 [RPC CONFIG]`
3. **Проверьте:**
   - Должно быть: `Custom RPC URL: ✅ Set`
   - Если видите `❌ Not set` - переменная не загружена

### Шаг 2: Проверьте формат RPC URL в Vercel

**Правильный формат:**
```
https://your-endpoint-name.base-sepolia.quiknode.pro/YOUR_API_KEY/
```

**Неправильные форматы:**
- `your-endpoint-name.base-sepolia.quiknode.pro/YOUR_API_KEY/` (без https://)
- `https://your-endpoint-name.base-sepolia.quiknode.pro/YOUR_API_KEY` (без слеша в конце - может быть OK)
- `https://your-endpoint-name.base-sepolia.quiknode.pro` (без API ключа)

### Шаг 3: Убедитесь, что передеплоили

1. После добавления переменной в Vercel
2. **Обязательно передеплойте:**
   - Deployments → последний deployment → Redeploy
3. **Перезагрузите страницу** после передеплоя (Ctrl+F5 или Cmd+Shift+R)

### Шаг 4: Проверьте, что RPC endpoint работает

Откройте ваш RPC URL в браузере (замените `eth_blockNumber` на любой метод):
```
https://your-endpoint.base-sepolia.quiknode.pro/YOUR_KEY/
```

Должен вернуться JSON, а не HTML страницу.

### Шаг 5: Проверьте QuickNode Dashboard

1. Откройте QuickNode Dashboard
2. Проверьте:
   - Endpoint активен (Status: Active)
   - Не превышен лимит запросов
   - Правильная сеть (Base Sepolia)

### Шаг 6: Попробуйте другой RPC endpoint

Если QuickNode не работает, попробуйте:

1. **Infura:**
   - https://infura.io/ → Create Project → Base Sepolia
   - Скопируйте HTTP URL
   - Добавьте в Vercel

2. **Ankr:**
   - https://www.ankr.com/ → Create API → Base Sepolia
   - Скопируйте URL
   - Добавьте в Vercel

### Шаг 7: Проверьте логи в консоли

После попытки транзакции, проверьте логи:

```
📡 [RPC CONFIG] Custom RPC URL: ✅ Set
📡 [RPC CONFIG] Using custom RPC: https://...
📡 [RPC] Custom RPC: ✅ https://...
```

Если видите `❌ Not set` или `using public endpoints` - переменная не загружена.

### Частые ошибки

1. **Переменная добавлена, но не передеплоена**
   - Решение: Передеплойте проект

2. **Переменная добавлена, но страница не перезагружена**
   - Решение: Перезагрузите страницу (Ctrl+F5)

3. **RPC URL без https://**
   - Решение: Добавьте `https://` в начало URL

4. **RPC endpoint неактивен или превышен лимит**
   - Решение: Проверьте QuickNode Dashboard

5. **Неправильная сеть в RPC endpoint**
   - Решение: Убедитесь, что endpoint для Base Sepolia, а не Base Mainnet

## Если ничего не помогает

1. Попробуйте подождать 10-15 минут (может быть временная проблема)
2. Создайте новый endpoint на QuickNode
3. Проверьте, что контракт существует на Base Sepolia:
   - https://sepolia.basescan.org/address/0x5d7683Ab887849543ae32287c26ac9da40423342

