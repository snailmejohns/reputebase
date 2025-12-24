# Настройка Vercel для монорепозитория

## Проблема

Если ваш проект имеет структуру монорепозитория (frontend, api, contracts в разных папках), Vercel по умолчанию не знает, где находится Next.js приложение.

## Решение

### Вариант 1: Использовать vercel.json (Рекомендуется)

Создайте файл `vercel.json` в корне репозитория:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

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

