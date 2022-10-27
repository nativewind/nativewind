npm version prerelease --preid $(git describe --tags --always) --no-git-tag-version
NATIVEWIND_VERSION=$(jq -r .version package.json)
docusaurus build

