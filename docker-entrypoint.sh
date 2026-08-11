#!/bin/sh
set -e

# Заменяем конфигурацию переданной переменной
cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  SHOW_SNOW: '${SHOW_SNOW:-false}'
};
EOF

# Запускаем переданную команду или nginx по умолчанию
if [ $# -eq 0 ]; then
    exec nginx -g "daemon off;"
else
    exec "$@"
fi