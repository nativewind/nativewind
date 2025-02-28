# NativeWind Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm i
```

### Local Development

Normally, you actually want to run this project from the root of this monorepo via

```
$ npm run website
```

However, this is currently not working so, for now, run the following from anywhere in the monorepo 
```
$ cd apps/website; npx docusaurus start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Structure

Most work on the NativeWind docs will pertain to the current version of NativeWind. Version 4 is the current version of NativeWind and the docs for it live in the `./docs` folder. The sidebar is configured via `./sidebars.js`. To use Docusaurus' nomenclature, version 4 is both the current version and the latest version. For previous versions, you can look to the directories prefixed with `./versioned_` and you'll be able to modify docs pertaining to older versions of NativeWind.

Docusaurus takes a bit of getting used to so I'd recommend you spend a little bit of time familiarizing with [their docs](https://docusaurus.io/docs/3.0.1/versioning) if you haven't already.