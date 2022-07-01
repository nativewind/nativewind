#!/usr/bin/env bash

CURRENT_BRANCH=$(git rev-parse --short HEAD)
BASELINE_BRANCH=${BASELINE_BRANCH:="next"}

# Gather baseline perf measurements
git checkout "$BASELINE_BRANCH";
npx reassure measure --baseline

# Gather current perf measurements
git checkout "$CURRENT_BRANCH";
npx reassure measure

# Compare results
npx reassure compare
