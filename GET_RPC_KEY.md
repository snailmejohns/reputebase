# Как получить бесплатный RPC ключ для Base Sepolia

## Проблема
Публичные RPC endpoints часто перегружены и возвращают ошибки "too many errors". Для надежной работы нужен собственный RPC endpoint.

## Решение: QuickNode (РЕКОМЕНДУЕТСЯ)

QuickNode - самый простой способ получить бесплатный RPC endpoint.

### Шаги:

1. **Зарегистрируйтесь на QuickNode:**
   - Откройте: https://www.quicknode.com/
   - Нажмите "Sign Up" (можно через GitHub/Google)
   - Подтвердите email

2. **Создайте Endpoint:**
   - После входа нажмите "Create Endpoint"
   - Выберите:
     - **Network**: Base
     - **Chain**: Base Sepolia (Testnet)
     - **Plan**: Free (до 10M запросов/месяц)
   - Нажмите "Continue"

3. **Скопируйте HTTP URL:**
   - После создания вы увидите URL вида:
     `https://your-endpoint-name.base-sepolia.quiknode.pro/YOUR_API_KEY/`
   - Скопируйте этот URL

4. **Добавьте в Vercel:**
   - Откройте Vercel → Settings → Environment Variables
   - Добавьте или измените:
     - **Key**: `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
     - **Value**: `https://your-endpoint-name.base-sepolia.quiknode.pro/YOUR_API_KEY/`
   - Сохраните

5. **Передеплойте:**
   - Deployments → последний deployment → Redeploy

## Альтернативы (если QuickNode недоступен)

### Option 2: Infura (если доступно)
1. Зарегистрируйтесь: https://infura.io/
2. Create Project → Base Sepolia
3. Скопируйте HTTP URL
4. Добавьте в Vercel как выше

### Option 3: Ankr (бесплатный tier)
1. Зарегистрируйтесь: https://www.ankr.com/
2. Create API → Base Sepolia
3. Скопируйте URL
4. Добавьте в Vercel

## Проверка

После добавления RPC URL:
1. Передеплойте проект
2. Попробуйте выполнить транзакцию
3. Проверьте консоль браузера - должны увидеть:
   `📡 [RPC] Configuring endpoint 1: https://your-quicknode-url`

## Важно

- **Без RPC ключа**: Приложение будет использовать публичные endpoints, которые могут быть перегружены
- **С RPC ключом**: Транзакции будут работать стабильно
- **Бесплатные лимиты**: Обычно достаточно для разработки и тестирования

