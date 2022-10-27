if [ "$VERCEL_ENV" == "preview" ]
then
  npm version prerelease -w nativewind --preid $(git describe --tags --always) --no-git-tag-version
  npm pkg get -w nativewind > ../node_modules/nativewind/package.json
fi
docusaurus build

