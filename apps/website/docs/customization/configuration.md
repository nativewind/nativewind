# Configuration

NativeWind uses the same `tailwind.config.js` as Tailwind CSS. You can read more about how to configure your project [through the Tailwind CSS documentation](https://tailwindcss.com/docs/configuration).

## Metro configuration

### `input`

**required**

Type: `string`

The path to the entry file for your Tailwind styles

### `projectRoot`

Default: `process.cwd()`

The path to the root of your project

### `outputDir`

Default: `node_modules/.cache/nativewind`

The path to the directory where the generated styles should be written. Should be relative to the `projectRoot`

### `configFile`

Default: `tailwind.config.js`

The path to your Tailwind config file

### `cliCommand`

Default: `node node_modules/tailwind/lib/cli.js`

The command to run the Tailwind CLI

### `browserslist`

Default: `last 1 versions`

The [browserslist used by browserslist & autoprefixer](https://github.com/postcss/autoprefixer)

### `browserslistEnv`

Default: `native`

The [environment used by browserslist & autoprefixer](https://github.com/browserslist/browserslist#configuring-for-different-environments)

### `hotServerOptions`

Default: `{ port: <next-available> }`

The options passed to `ws` for the development hot reloading server.
