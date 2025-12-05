# 🚂 Деплой API на Railway - Подробная инструкция

## 🔍 Где указать Root Directory в Railway

### Способ 1: При создании проекта

1. Зайдите на https://railway.app
2. Нажмите **"New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Выберите репозиторий `reputebase`
5. **ВАЖНО:** После создания проекта:
   - Зайдите в настройки проекта (Settings)
   - Найдите секцию **"Source"** или **"Build"**
   - Найдите поле **"Root Directory"** или **"Working Directory"**
   - Введите: `api`
   - Сохраните

### Способ 2: Через Settings после создания

Если проект уже создан:

1. Зайдите в ваш проект на Railway
2. Перейдите в **Settings** (вкладка справа)
3. Найдите секцию **"Source"**
4. Найдите поле **"Root Directory"** или **"Working Directory"**
5. Введите: `api`
6. Нажмите **"Save"** или **"Update"**

### Способ 3: Через railway.json (рекомендуется)

Создайте файл `railway.json` в корне репозитория:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd api && npm install"
  },
  "deploy": {
    "startCommand": "cd api && node index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Или более простой вариант - создайте `railway.toml` в папке `api/`:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node index.js"
```

---

## ⚠️ Решение проблемы "Error creating build plan with Railpack"

Эта ошибка обычно возникает, когда Railway не может определить тип проекта. Решения:

### Решение 1: Добавьте railway.json в корень

Создайте файл `/Users/nikolajburlakov/Work/Base/reputebase/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd api && node index.js"
  }
}
```

### Решение 2: Убедитесь, что package.json правильный

Проверьте, что в `api/package.json` есть:

```json
{
  "name": "@reputebase/api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.x.x",
    "ethers": "^6.x.x",
    "cors": "^2.x.x",
    "dotenv": "^16.x.x"
  }
}
```

### Решение 3: Используйте Dockerfile (если Nixpacks не работает)

Создайте `api/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем только package.json сначала (для кеширования)
COPY api/package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем остальные файлы
COPY api/ .

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["node", "index.js"]
```

Затем в Railway Settings → Build → Builder выберите **"Dockerfile"**

---

## 📋 Пошаговая инструкция для Railway

### Шаг 1: Подготовка проекта

```bash
cd /Users/nikolajburlakov/Work/Base/reputebase

# Убедитесь, что package.json в api/ правильный
cat api/package.json
```

### Шаг 2: Создайте railway.json (если нужно)

```bash
# Создайте railway.json в корне
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd api && node index.js"
  }
}
EOF
```

### Шаг 3: Настройка в Railway

1. **Зайдите на Railway:** https://railway.app
2. **Создайте проект:**
   - New Project → Deploy from GitHub repo
   - Выберите `snailmejohns/reputebase`
3. **Настройте Root Directory:**
   - Settings → Source
   - Root Directory: `api`
   - Или используйте railway.json (см. выше)
4. **Настройте Build:**
   - Settings → Build
   - Build Command: (оставьте пустым или `npm install`)
   - Start Command: `node index.js`
5. **Добавьте переменные окружения:**
   - Settings → Variables
   - Добавьте:
     ```
     NETWORK=sepolia
     BASE_SEPOLIA_RPC=https://sepolia.base.org
     BASE_MAINNET_RPC=https://mainnet.base.org
     REPUTE_CORE_ADDRESS=0xF0E6165E409DB7C7e665c6a7cb34e71983fDF224
     BADGE_NFT_ADDRESS=0x3BF942e76cC4d59C75f8CA340556117D000C4FC7
     PORT=3001
     ```
6. **Сохраните и передеплойте:**
   - Нажмите "Deploy" или подождите автоматического деплоя

---

## 🔧 Альтернатива: Используйте Render

Если Railway продолжает вызывать проблемы, используйте Render:

### Render Setup:

1. Зайдите на https://render.com
2. New → Web Service
3. Connect GitHub → выберите репозиторий
4. Настройки:
   - **Name:** reputebase-api
   - **Root Directory:** `api`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Добавьте переменные окружения (как в Railway)
6. Deploy

Render обычно проще для поддиректорий!

---

## ✅ Проверка после деплоя

После успешного деплоя:

1. Получите URL из Railway (например: `https://reputebase-production.up.railway.app`)
2. Проверьте health endpoint:
   ```bash
   curl https://your-railway-url.railway.app/health
   ```
3. Проверьте reputation endpoint:
   ```bash
   curl https://your-railway-url.railway.app/reputation/0x73F2890316e9475B195c20371539CCd187f67998
   ```
4. Обновите `NEXT_PUBLIC_API_URL` в Vercel с новым URL

---

## 🐛 Troubleshooting

### Ошибка: "Error creating build plan with Railpack"

**Решение:**
- Добавьте `railway.json` в корень проекта
- Или используйте Dockerfile
- Или переключитесь на Render

### Ошибка: "Cannot find module"

**Решение:**
- Убедитесь, что Root Directory указан как `api`
- Проверьте, что `package.json` в `api/` правильный
- Убедитесь, что все зависимости в `package.json`

### Ошибка: "Port already in use"

**Решение:**
- Railway автоматически назначает порт через переменную `PORT`
- Убедитесь, что в `api/index.js` используется `process.env.PORT || 3001`

---

**Рекомендация:** Если Railway продолжает вызывать проблемы, используйте Render - он проще для проектов с поддиректориями!

