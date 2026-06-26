#!/usr/bin/env bash
set -uo pipefail

platform="$1"
app_target="$2"
artifact_path="${3:-}"
evidence_dir="${4:-evidence/$platform}"

mkdir -p "$evidence_dir"
touch "$evidence_dir/agent-device.log"
commands_file="$evidence_dir/commands.jsonl"
: > "$commands_file"

record() {
  local name="$1"
  local exit_code="$2"
  local started_at="$3"
  local artifact="${4:-}"
  local ended_at duration_ms size

  ended_at="$(date +%s)"
  duration_ms=$(( (ended_at - started_at) * 1000 ))
  size="null"
  if [ -n "$artifact" ] && [ -f "$artifact" ]; then
    size="$(wc -c < "$artifact" | tr -d ' ')"
  fi

  printf '{"name":"%s","exitCode":%d,"durationMs":%d,"artifact":"%s","artifactBytes":%s}\n' \
    "$name" "$exit_code" "$duration_ms" "$artifact" "$size" >> "$commands_file"
}

run_cmd() {
  local name="$1"
  shift
  local started_at exit_code

  started_at="$(date +%s)"
  "$@" 2>> "$evidence_dir/agent-device.log"
  exit_code=$?
  record "$name" "$exit_code" "$started_at"
  return 0
}

run_to_file() {
  local name="$1"
  local artifact="$2"
  shift 2
  local started_at exit_code

  started_at="$(date +%s)"
  "$@" > "$artifact" 2>> "$evidence_dir/agent-device.log"
  exit_code=$?
  record "$name" "$exit_code" "$started_at" "$artifact"
  return 0
}

run_artifact_cmd() {
  local name="$1"
  local artifact="$2"
  shift 2
  local started_at exit_code

  started_at="$(date +%s)"
  "$@" 2>> "$evidence_dir/agent-device.log"
  exit_code=$?
  record "$name" "$exit_code" "$started_at" "$artifact"
  return 0
}

agent-device --version > "$evidence_dir/agent-device-version.txt" 2>> "$evidence_dir/agent-device.log" || true

if [ -n "$artifact_path" ]; then
  run_cmd install agent-device install "$app_target" "$artifact_path" --platform "$platform"
fi

if [ "$platform" = "ios" ]; then
  run_cmd prepare-ios-runner agent-device prepare ios-runner --platform ios --timeout 240000
fi

run_cmd open-save-script agent-device open "$app_target" --platform "$platform" --save-script "$evidence_dir/launch.ad"
run_cmd logs-clear agent-device logs clear --restart --platform "$platform"

if [ "$platform" = "ios" ]; then
  run_cmd open-relaunch agent-device open "$app_target" --platform ios --relaunch --launch-console "$evidence_dir/app.console.log"
else
  run_cmd open-relaunch agent-device open "$app_target" --platform "$platform" --relaunch
fi

run_cmd wait-startup agent-device wait 25000 --platform "$platform"
run_artifact_cmd screenshot "$evidence_dir/screen.png" agent-device screenshot "$evidence_dir/screen.png" --platform "$platform"
run_to_file perf "$evidence_dir/perf.json" agent-device perf --json --platform "$platform"
run_to_file snapshot "$evidence_dir/snapshot.txt" agent-device snapshot --platform "$platform"
run_to_file snapshot-interactive "$evidence_dir/snapshot-interactive.txt" agent-device snapshot -i --platform "$platform"
run_to_file logs-path "$evidence_dir/logs-path.txt" agent-device logs path --platform "$platform"

log_path="$(awk 'NF && $1 ~ /^\// { print $1; exit }' "$evidence_dir/logs-path.txt" 2>/dev/null || true)"
if [ -n "$log_path" ] && [ -f "$log_path" ]; then
  cp "$log_path" "$evidence_dir/device.log" || true
  printf '{"name":"copy-device-log","exitCode":0,"durationMs":0,"artifact":"%s","artifactBytes":%s}\n' \
    "$evidence_dir/device.log" "$(wc -c < "$evidence_dir/device.log" | tr -d ' ')" >> "$commands_file"
else
  printf '{"name":"copy-device-log","exitCode":1,"durationMs":0,"artifact":"%s","artifactBytes":null}\n' \
    "$evidence_dir/device.log" >> "$commands_file"
fi

run_cmd close agent-device close --platform "$platform"
