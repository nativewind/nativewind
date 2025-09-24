const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

/** START - None of this code is necessary, its only to resolve node_modules inside the monorepo */
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];
config.watchFolders = [path.resolve(__dirname, "../")];
/** END - None of this code is necessary, its only to resolve node_modules inside the monorepo */

module.exports = withNativewind(config);
