# Vercel Environment Variables Setup

## Required Environment Variables

Для работы приложения на Vercel необходимо настроить следующие переменные окружения:

### 1. API Configuration
```
NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
```
**Важно:** Замените `your-api-url` на реальный URL вашего API на Railway.

### 2. Contract Addresses
```
NEXT_PUBLIC_REPUTE_CORE_ADDRESS=0x...
NEXT_PUBLIC_BADGE_NFT_ADDRESS=0x...
NEXT_PUBLIC_TX_VOLUME_MODULE_ADDRESS=0x5d7683Ab887849543ae32287c26ac9da40423342
```

### 3. WalletConnect
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```
Получите Project ID на https://cloud.walletconnect.com

### 4. RPC Configuration (РЕКОМЕНДУЕТСЯ)
```
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```
Или используйте Infura:
```
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/YOUR_PROJECT_ID
```

**Важно:** Без этого переменная будет использоваться публичный RPC, который может быть перегружен.

### 5. Optional: Monitoring
```
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Как добавить переменные в Vercel

1. Откройте ваш проект на Vercel
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте каждую переменную:
   - **Key**: название переменной (например, `NEXT_PUBLIC_API_URL`)
   - **Value**: значение переменной
   - **Environment**: выберите `Production`, `Preview`, и/или `Development`
4. Нажмите **Save**
5. **Передеплойте** проект (Deployments → Redeploy)

## Проверка

После добавления переменных:
1. Убедитесь, что все переменные добавлены
2. Передеплойте проект
3. Проверьте консоль браузера на наличие ошибок
4. Проверьте, что API доступен по указанному URL

## Troubleshooting

### "Failed to fetch reputation: Unknown error"
- Проверьте, что `NEXT_PUBLIC_API_URL` установлен и доступен
- Проверьте, что API работает на Railway
- Проверьте CORS настройки API

### "RPC endpoint returned too many errors"
- Приложение автоматически переключается между несколькими бесплатными endpoints
- Подождите несколько секунд и попробуйте снова
- Если проблема сохраняется, попробуйте позже (публичные endpoints могут быть временно перегружены)
- Для максимальной надежности можно добавить платный RPC endpoint (Alchemy/Infura/QuickNode)

### "Transaction failed: Requested resource not available"
- Это временная проблема с RPC endpoint
- Приложение автоматически попробует другой endpoint
- Подождите и попробуйте снова через несколько секунд

