# Стадия 1: сборка
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости (с проверкой наличия lock-файла)
RUN npm ci \
    --include=dev \
    --no-audit \
    --no-fund \
    --legacy-peer-deps

# Копируем исходный код
COPY . .
COPY .env.production .env

RUN npm ls react-scripts && \
    ls -la node_modules/.bin/react-scripts && \
    npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
