if [ "$VERCEL_ENV" == "preview" ]
then
  npm version prerelease -w nativewind --preid $(git describe --tags --always) --no-git-tag-version
fi
docusaurus build

