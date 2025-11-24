#FROM nginx
#
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
##ENV REACT_APP_API_URL="http://localhost:8080/api"
#
#WORKDIR /usr/share/react
#
#RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
#RUN apt-get install -y nodejs
#
#COPY package*.json ./
#
#RUN npm install
#
#COPY . .
#COPY .env.production .env
#
#RUN npm run build
#
#RUN rm -r /usr/share/nginx/html/*
#
#RUN cp -a build/. /usr/share/nginx/html
#
## Этой строкой мы указываем, что наше приложение слушает порт 3000
##EXPOSE 3000
#
## Команда для запуска сервера
#CMD ["nginx", "-g", "daemon off;"]

# Стадия 1: Сборка приложения
# FROM node:18 as builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# COPY .env.production .env
# COPY .babelrc .babelrc
# RUN npm run build

# # Стадия 2: Копирование сборки в образ с Nginx
# FROM nginx

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# WORKDIR /usr/share/nginx/html

# # Копирование статических файлов из стадии 1
# COPY --from=builder /app/build .

# # Опциональные: Настройка Nginx и установка дополнительных инструментов
# # ...

# # Удаление временных файлов и пакетных менеджеров
# RUN rm -rf /app \
#     && apt-get update \
#     && apt-get install -y --no-install-recommends \
#         # установка дополнительных инструментов (если необходимо) \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Команда для запуска сервера Nginx
# CMD ["nginx", "-g", "daemon off;"]

# Стадия 1: сборка
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости (с проверкой наличия lock-файла)
RUN set -eux; \
    if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Копируем исходный код
COPY . .
COPY .env.production .env

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

