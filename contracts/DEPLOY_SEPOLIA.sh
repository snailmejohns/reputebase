#!/bin/bash

# Скрипт для деплоя на Base Sepolia
# Использование: ./DEPLOY_SEPOLIA.sh

set -e

echo "🚀 Деплой ReputeBase на Base Sepolia"
echo ""

# Загружаем переменные окружения
if [ -f .env ]; then
    source .env
    echo "✅ .env файл загружен"
else
    echo "❌ Ошибка: .env файл не найден!"
    exit 1
fi

# Проверяем переменные
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Ошибка: PRIVATE_KEY не установлен в .env"
    exit 1
fi

if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo "❌ Ошибка: BASE_SEPOLIA_RPC_URL не установлен в .env"
    exit 1
fi

# Проверяем баланс
ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
BALANCE=$(cast balance $ADDRESS --rpc-url base_sepolia)

echo "📍 Адрес деплоера: $ADDRESS"
echo "💰 Баланс: $(cast --to-unit $BALANCE ether) ETH"
echo ""

if [ "$(cast --to-unit $BALANCE ether | cut -d. -f1)" -lt "0.001" ]; then
    echo "⚠️  Внимание: Баланс очень низкий! Нужно минимум 0.001 ETH для деплоя."
    echo "   Получите ETH на: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
    read -p "Продолжить? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Начинаю деплой..."
echo ""

# Деплой без verify (чтобы избежать проблем)
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📝 Если нужно верифицировать контракты, используйте:"
echo "   forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --chain-id 84532 --etherscan-api-key \$BASESCAN_API_KEY"
echo ""
echo "💡 Сохраните адреса контрактов из вывода выше!"

