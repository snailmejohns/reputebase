# Настройка Vercel для монорепозитория

## Проблема

Если ваш проект имеет структуру монорепозитория (frontend, api, contracts в разных папках), Vercel по умолчанию не знает, где находится Next.js приложение.

## Решение

### Вариант 1: Использовать vercel.json + Dashboard (Рекомендуется)

**Важно:** `rootDirectory` НЕ может быть в `vercel.json` - его нужно настроить в Vercel Dashboard!

1. **Создайте файл `vercel.json`** в корне репозитория:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

2. **Настройте Root Directory в Vercel Dashboard:**
   - Settings → General → Root Directory → `frontend`
   - Сохраните изменения

### Вариант 2: Настроить в Vercel Dashboard

1. Откройте проект в Vercel Dashboard
2. Перейдите в **Settings** → **General**
3. Найдите секцию **Root Directory**
4. Установите значение: `frontend`
5. Сохраните изменения
6. Передеплойте проект

### Вариант 3: Использовать Vercel CLI

```bash
vercel --cwd frontend
```

## Что делает каждая настройка?

- **`rootDirectory`**: Указывает Vercel, где находится Next.js приложение
- **`buildCommand`**: Команда для сборки (по умолчанию `npm run build`)
- **`outputDirectory`**: Где находится собранное приложение (по умолчанию `.next`)
- **`installCommand`**: Команда для установки зависимостей (по умолчанию `npm install`)

## Проверка

После настройки:
1. Передеплойте проект
2. Проверьте, что билд проходит успешно
3. Откройте сайт - должна загрузиться главная страница, а не 404

## Частые ошибки

### ❌ 404 NOT_FOUND
- **Причина**: Vercel не находит Next.js приложение
- **Решение**: Установите `rootDirectory: "frontend"` в vercel.json или в настройках

### ❌ Build failed: Cannot find module
- **Причина**: Зависимости устанавливаются не в той папке
- **Решение**: Убедитесь, что `installCommand` запускается в правильной директории

### ❌ Build output not found
- **Причина**: Неправильный `outputDirectory`
- **Решение**: Убедитесь, что путь к `.next` правильный (обычно `frontend/.next`)

