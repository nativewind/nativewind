const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// 1. Enable CSS for Expo.
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// This is not needed for NativeWind, it is configuration for Metro to understand monorepos
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 2. Enable NativeWind
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(config, {
  // 3. Set `input` to your CSS file with the Tailwind at-rules
  input: "global.css",
  // This is optional
  projectRoot,
  inlineRem: false,
  features: {
    transformPercentagePolyfill: true,
  },
});
