#!/usr/bin/env sh
set -eu

if [ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ] && [ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
  echo "GOOGLE_APPLICATION_CREDENTIALS points to a missing file in this container. Falling back to Cloud Run service account credentials."
  unset GOOGLE_APPLICATION_CREDENTIALS
fi

exec java -jar app.jar
