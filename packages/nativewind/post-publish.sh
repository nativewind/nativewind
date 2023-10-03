#!/usr/bin/env bash

# Just wait a short amount for the package to be available
sleep 15

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",[:space:]]//g')

curl -XGET "https://snackager.expo.io/bundle/nativewind@$PACKAGE_VERSION?platforms=ios,android,web&version_snackager=true&bypassCache=true"