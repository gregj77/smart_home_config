#!/bin/sh
cd "$(dirname "$0")" || exit 1
docker compose run --rm certbot && docker compose exec nginx nginx -s reload

