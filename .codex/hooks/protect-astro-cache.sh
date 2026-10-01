#!/bin/bash
# Blocks rm on the .astro / .vite cache folders: deleting them under a running
# `astro dev` wipes its content store and every route returns 404 until restart.
cmd=$(jq -r '.tool_input.command // ""')

if printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])rm[[:space:]]' &&
  printf '%s' "$cmd" | grep -Eq '(^|[[:space:]/"'\''])\.(astro|vite)([/[:space:]"'\'';&|)]|$)'; then
  echo "Blocked: never delete .astro or .vite caches. It breaks the running astro dev server (404 on every route). Run a plain 'astro build' instead, or build a copy in the scratchpad." >&2
  exit 2
fi
exit 0
