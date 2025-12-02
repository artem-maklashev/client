#!/bin/sh
set -e

# Подстановка переменной окружения
sed -i "s#__SHOW_SNOW__#${SHOW_SNOW}#g" /usr/share/nginx/html/runtime-config.js

exec "$@"
