#!/bin/sh

ENV="$(cat <<EOF
  window.env = {
      NEXT_PUBLIC_MAIN_API_DOMAIN: "$NEXT_PUBLIC_MAIN_API_DOMAIN",
      NEXT_PUBLIC_MAIN_SUBS_DOMAIN: "$NEXT_PUBLIC_MAIN_SUBS_DOMAIN",
      NEXT_PUBLIC_SERVER_API_DOMAIN: "$NEXT_PUBLIC_SERVER_API_DOMAIN",
      NEXT_PUBLIC_SERVER_DOMAIN: "$NEXT_PUBLIC_SERVER_DOMAIN",
  }
EOF
)"

echo $ENV > /exm/public/js/env.js

exec "$@"
