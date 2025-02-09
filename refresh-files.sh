#!/bin/sh
cd "$(dirname "$0")" || exit 1
[ -z "$1" ] && { echo "Error: Missing argument"; exit 1; }
docker compose exec -u www-data next-cloud php /var/www/html/occ files:scan --path="/$1/"
