Отвечу как всемирно известный DevOps-инженер и архитектор инфраструктуры, PhD по сетевой безопасности, лауреат Dutch IT-channel Award.

**TL;DR:** переводим приложение на HTTPS через reverse-proxy Nginx с автоматическими сертификатами Let’s Encrypt. Настраиваем 301-редирект с HTTP→HTTPS, проксирование `/api` на Spring Boot, включаем HSTS, безопасные заголовки, обновляем фронтенд-переменные (`REACT_APP_*/VITE_*`) на `https://…` и `wss://…`, чиним CORS/куки и проводим проверку (curl, браузер, SSL Labs).

---

## Пошаговый план с объяснениями

### 0) Что у нас есть и что выберем

* **Фронтенд:** React/TypeScript (PrimeReact), сейчас по HTTP.
* **Бэкенд:** Spring Boot по HTTP (обычно `:8080`).
* **Сервер:** виртуалка с Linux (предположу Ubuntu/Debian).
* **Цель:** один домен (например, `app.example.com`) на HTTPS, фронт раздаётся Nginx-ом, бэкенд проксируется по пути `/api`.
* **Почему reverse-proxy, а не TLS прямо в Spring?** Так проще управлять сертификатами (автообновление), склеивать фронт+бэк на одном домене/порту и добавлять безопасные заголовки на краю.

> Если у вас уже разделены домены (`app.example.com` и `api.example.com`) — ниже будут ремарки для двух доменов.

---

### 1) Готовим DNS

**Что делаем:** создаём A/AAAA запись на ваш сервер (например, `app.example.com → <IP сервера>`).
**Зачем:** Let’s Encrypt проверит домен, а пользователи будут попадать на ваш сервер.
**Как понять, что ок:** `dig app.example.com +short` должен отдавать ваш IP.

---

### 2) Ставим и настраиваем Nginx + Certbot

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo apt install -y certbot python3-certbot-nginx
```

**Зачем:** Nginx — фронтовой сервер и TLS-терминатор, Certbot — автоматические сертификаты.

---

### 3) Базовая конфигурация Nginx (до сертификата)

Создаём конфиг (подставьте ваш домен и путь к билду фронта):

```bash
sudo nano /etc/nginx/sites-available/app.conf
```

Содержимое:

```nginx
server {
    listen 80;
    server_name app.example.com;

    # Временно отдадим фронт по HTTP, чтобы certbot увидел сайт
    root /var/www/app;         # тут лежит сборка React (build/dist)
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Проксирование API на Spring Boot (локально на 8080)
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;   # обратите внимание на завершающий /
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Для WebSocket'ов (если есть /api/ws)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Активация:

```bash
sudo ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/app.conf
sudo nginx -t && sudo systemctl reload nginx
```

---

### 4) Получаем и подключаем сертификат Let’s Encrypt

```bash
sudo certbot --nginx -d app.example.com --redirect --email you@example.com --agree-tos
```

**Что происходит:**

* Certbot докручивает `listen 443 ssl http2;` и укажет пути к сертификатам.
* `--redirect` добавит 301-редирект HTTP→HTTPS.
* Создастся systemd-таймер автообновления.

**Проверка автообновления:**

```bash
sudo certbot renew --dry-run
```

---

### 5) Доводим безопасность и производительность в Nginx

Откройте `app.conf` (443-серверный блок) и добавьте заголовки:

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    # ssl_certificate/ssl_certificate_key уже вставит certbot

    # Жёсткая принудиловка HTTPS для браузеров (HSTS)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Базовые безопасные заголовки
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header Referrer-Policy no-referrer-when-downgrade always;
    add_header X-XSS-Protection "0" always; # в новых браузерах не нужен, но безвреден

    # Минимальный CSP (позже сузите под ваш бандл)
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https: wss:;" always;

    root /var/www/app;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Перезагрузка:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### 6) Готовим фронтенд к HTTPS

**Задача:** убрать смешанный контент и жёстко прописанные `http://…`.

1. **Переменные окружения:**

   * CRA:

     ```
     # .env.production
     REACT_APP_API_BASE_URL=https://app.example.com/api
     ```
   * Vite:

     ```
     # .env.production
     VITE_API_BASE_URL=https://app.example.com/api
     ```
2. **HTTP→HTTPS/WSS:**
   Во всех `fetch/axios` и WebSocket-клиентах используйте:

   ```ts
   const api = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
   const wsUrl = api.replace(/^http(s?):\/\//, 'ws$1://') + '/ws';
   ```
3. **Service Worker (если есть):**
   Обновите версию/хэш, пересоберите, иначе старая кэширующая версия может тянуть `http://`.
4. **Сборка и выкладка:**

   ```bash
   # CRA
   npm run build   # или yarn build
   # Vite
   npm run build
   sudo rm -rf /var/www/app/*
   sudo cp -r ./build/* /var/www/app/      # CRA
   # или: sudo cp -r ./dist/* /var/www/app/  # Vite
   ```

---

### 7) Настраиваем Spring Boot под прокси/HTTPS-мир

**Цель:** корректные абсолютные ссылки, CORS, куки и безопасность.

`application.yml` (или `application.properties`):

```yaml
server:
  forward-headers-strategy: native  # уважать X-Forwarded-* от Nginx
  servlet:
    session:
      cookie:
        secure: true         # только по HTTPS
        same-site: Lax        # настройте по вашей авторизации (Lax/Strict/None)

# Если используете CORS в Spring
spring:
  web:
    cors:
      mappings:
        - path-pattern: /api/**          # ваш API
          allowed-origins: "https://app.example.com"
          allowed-methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS"
          allow-credentials: true
          allowed-headers: "*"
```

**Почему это важно:**

* `forward-headers-strategy` даёт приложению знать, что оригинальная схема — HTTPS, а не `http` за прокси (важно для генерации ссылок, OAuth-редиректов и т. п.).
* `cookie.secure=true` исключит утечки сессии по HTTP.
* `same-site` подберите под ваш SSO/флоу авторизации.
* CORS: если фронт и бэк на одном домене — можно вообще запретить CORS или ограничить только `https://app.example.com`.

> Если вы предпочитаете **TLS прямо в Spring Boot** (без Nginx-TLS): создайте PKCS12-хранилище и настройте `server.ssl.*`. Это усложнит автообновление сертификатов, поэтому для продакшна чаще выбирают Nginx-терминацию.

---

### 8) Тестирование

1. **Редирект:**

   ```bash
   curl -I http://app.example.com
   # Должно быть: HTTP/1.1 301 Moved Permanently → Location: https://app.example.com/
   ```
2. **SSL/HTTP2:**

   ```bash
   curl -I https://app.example.com
   # Должно быть: HTTP/2 200, alt-svc может появиться, h2 активен
   ```
3. **API:**

   ```bash
   curl -i https://app.example.com/api/health
   ```
4. **Браузер → DevTools → Security:** зелёный замок, без mixed content.
5. **Автотест сертификата:** SSL Labs (вручную откройте и проверьте оценку, цель — A/A+).

---

### 9) Двухдоменная схема (если нужно)

* `app.example.com` — фронт.
* `api.example.com` — бэк.
  Тогда:
* Получаем два сертификата:

  ```bash
  sudo certbot --nginx -d app.example.com --redirect
  sudo certbot --nginx -d api.example.com --redirect
  ```
* В фронтовом `.env.production`: `API_BASE_URL=https://api.example.com`.
* В Spring CORS `allowed-origins: "https://app.example.com"`.
* В Nginx для `api.example.com` делаем отдельный `server` без статического `root`, только `proxy_pass` на `127.0.0.1:8080`.

---

### 10) Полезные мелочи и «грабли»

* **Mixed content:** любая внешняя картинка/скрипт по `http://` — сломает замок. Ищите и переводите на `https://`.
* **OAuth/SSO:** обновите Redirect URI на HTTPS в провайдерах (Google/Microsoft/Keycloak и т. п.).
* **WebSocket:** только `wss://` за HTTPS.
* **Куки авторизации:** если используете `SameSite=None`, **обязательно** `Secure`.
* **HSTS preload:** включили `preload` — ок. Зарегистрируйте домен в списке preload только после полной уверенности (иначе возврата на HTTP не будет).
* **Логи:** при ошибках смотрим `sudo tail -f /var/log/nginx/error.log` и логи Spring.
* **Firewall:** откройте 80/443; 80 нужен для HTTP-01 проверки Let’s Encrypt.
* **CI/CD:** храните домены и URL’ы в `.env` (production), не хардкодьте в код.
* **Zero-downtime:** перед `nginx -t && reload` всегда проверяйте конфиг; держите бэкап предыдущего.

---

### 11) Мини-чеклист готовности

* Домены указывают на сервер.
* `http://` → 301 → `https://`.
* Фронт открывается по `https://`, без mixed content.
* `/api` отвечает через Nginx, `wss://` работает.
* Куки `Secure`, CORS ограничен на нужный origin.
* HSTS включён, базовые безопасные заголовки на месте.
* Certbot auto-renew проходит `--dry-run`.

---

Если хотите, могу адаптировать конфиги под **ваши** точные домены/пути, подсказать корректные `application.yml` и `.env.production` по вашему проекту — просто напишите, какие домены будете использовать и на каких портах сейчас крутятся фронт и бэк.
