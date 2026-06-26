#!/usr/bin/env bash
set -euo pipefail

scaffold_repro() {
  local channel="latest"
  local flags=(--nativewind)

  case "${SCAFFOLD_FLAVOR:-latest-plain}" in
    next-expo-router)
      channel="next"
      flags=(--nativewind --expo-router)
      ;;
    next-react-navigation)
      channel="next"
      flags=(--nativewind --reactNavigation)
      ;;
    next-plain)
      channel="next"
      ;;
    latest-expo-router)
      flags=(--nativewind --expo-router)
      ;;
    latest-react-navigation)
      flags=(--nativewind --reactNavigation)
      ;;
  esac

  echo "Scaffolding rn-new@$channel repro ${flags[*]} --default --noInstall --noGit"
  npx --yes "rn-new@$channel" repro "${flags[@]}" --default --noInstall --noGit
  test -d repro && test -f repro/package.json
}

install_repro_dependencies() {
  local repro_dir="${1:-repro}"

  cd "$repro_dir"
  if [ -f yarn.lock ]; then
    corepack enable
    yarn install --frozen-lockfile || yarn install
  elif [ -f pnpm-lock.yaml ]; then
    corepack enable
    pnpm install --frozen-lockfile || pnpm install
  elif [ -f package-lock.json ]; then
    npm ci || npm install
  elif [ -f bun.lockb ]; then
    npm i -g bun
    bun install
  else
    npm install
  fi
}

case "${1:-}" in
  scaffold)
    scaffold_repro
    ;;
  install-deps)
    install_repro_dependencies "${2:-repro}"
    ;;
  *)
    echo "Usage: $0 {scaffold|install-deps [repro-dir]}" >&2
    exit 2
    ;;
esac
