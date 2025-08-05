const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");
const { withReactNativeCSS } = require("react-native-css/metro");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

config.resolver.extraNodeModules = {
  nativewind: path.resolve(__dirname, "../"),
};

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../node_modules"),
];

config.watchFolders = [path.resolve(__dirname, "../")];

module.exports = withReactNativeCSS(config, {
  globalClassNamePolyfill: true,
});
