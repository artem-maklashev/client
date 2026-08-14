# ==========================================
# Этап 1: Сборка приложения (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем манифесты зависимостей
COPY package*.json ./

# Устанавливаем зависимости с полной переустановкой опциональных зависимостей
RUN npm install --legacy-peer-deps --force

# Копируем исходный код
COPY . .

# Собираем бандл через npm скрипт
RUN npm run build

# ==========================================
# Этап 2: Финальный веб-сервер (Nginx)
# ==========================================
FROM nginx:alpine AS runner

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
