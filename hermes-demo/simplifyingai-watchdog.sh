#!/usr/bin/env bash
# simplifyingai-watchdog.sh — silent watchdog for simplifyingai.co
# Pre-run gate for a Hermes cron job. Always exits 0.
# - Healthy (HTTP 200): outputs NOTHING + {"wakeAgent": false} → LLM stays asleep, silent tick.
# - Unhealthy: outputs a [SILENT] alert line + NOTHING else → LLM wakes, reads the alert, reports it.
# The [SILENT] marker on a HEALTHY run is what the delivery layer suppresses.
# Design note: this script is the "pre-run gate" the user asked for — the model only wakes
# when there's something to report. The [SILENT] pattern is handled by the LLM prompt below.

URL="https://simplifyingai.co"
TIMEOUT=10

http_code=$(curl -sSL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" --connect-timeout "$TIMEOUT" "$URL" 2>/dev/null)
curl_exit=$?

if [ "$curl_exit" -ne 0 ]; then
  echo "[SILENT] simplifyingai.co UNREACHABLE (curl exit $curl_exit)"
  exit 0
fi

if [ "$http_code" != "200" ]; then
  echo "[SILENT] simplifyingai.co returned HTTP $http_code (expected 200)"
  exit 0
fi

# Healthy: emit the gate-closing line that tells Hermes NOT to wake the LLM.
# Per cron docs: {"wakeAgent": false} on the last stdout line → silent tick (same gate LLM jobs use).
echo '{"wakeAgent": false}'
exit 0
