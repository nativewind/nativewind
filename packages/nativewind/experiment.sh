#!/usr/bin/env bash

npm run build && \
npm version $(git describe --tags) --no-git-tag-version;
npm publish --tag experiment && sleep 30 && \
curl "https://snackager.expo.io/bundle/nativewind@$(git describe --tags)?platforms=ios,android,web&version_snackager=true&bypassCache=true" --retry 5
