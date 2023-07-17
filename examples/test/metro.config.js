const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// 1. Enable CSS for Expo. This allows web to use CSS StyleSheets
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

// 2. Enable NativeWind
const { withNativeWind } = require("nativewind/metro")
module.exports = withNativeWind(config, {
  input: "global.css"
});
