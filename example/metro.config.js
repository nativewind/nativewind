const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");

/* Use `const { withNativewind } = require("nativewind/metro");` in your project instead */
const { withNativewind } = require("../dist/commonjs/metro");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

/** START - None of this code is necessary, its only to resolve Nativewind from the monorepo */
config.resolver.unstable_enablePackageExports = true;
config.resolver.extraNodeModules = {
  nativewind: path.resolve(__dirname, "../"),
};
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];
config.watchFolders = [path.resolve(__dirname, "../")];
/** END - None of this code is necessary, its only to resolve Nativewind from the monorepo */

module.exports = withNativewind(config);
