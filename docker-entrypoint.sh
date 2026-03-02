#!/bin/sh
# Заменяем конфигурацию переданной переменной
cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  SHOW_SNOW: '${SHOW_SNOW:-false}'
};
EOF

# Запускаем nginx
exec "$@"