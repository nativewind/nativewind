export function getNativeJS(data = {}, dev = false) {
  let output = `
 "use strict";
 "__css-interop-transformed";
Object.defineProperty(exports, "__esModule", { value: true });
const __inject_1 = require("react-native-css-interop/dist/runtime/native/styles");
(0, __inject_1.injectData)(${JSON.stringify(data)}); 
`;

  if (dev) {
    output += `
/**
 * This is a hack for Expo Router. It's _layout files export 'unstable_settings' which break Fast Refresh
 * Expo Router only supports Metro as a bundler
 */
if (typeof __METRO_GLOBAL_PREFIX__ !== "undefined" && global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"]) {
  const Refresh = global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"]
  const isLikelyComponentType = Refresh.isLikelyComponentType
  const expoRouterExports = new WeakSet()
  Object.assign(Refresh, {
    isLikelyComponentType(value) {
      if (typeof value === "object" && "unstable_settings" in value) {
        expoRouterExports.add(value.unstable_settings)
      }

      if (typeof value === "object" && "ErrorBoundary" in value) {
        expoRouterExports.add(value.ErrorBoundary)
      }

      // When ErrorBoundary is exported, the inverse dependency will also include the _ctx file. So we need to account for it as well
      if (typeof value === "object" && "ctx" in value && value.ctx.name === "metroContext") {
        expoRouterExports.add(value.ctx)
      }

      return expoRouterExports.has(value) || isLikelyComponentType(value)
    }
  })
}
`;
  }

  return Buffer.from(output);
}

export function platformPath(filePath: string, platform: string) {
  return `${filePath}.${platform}.${platform === "web" ? "css" : "js"}`;
}

export function resolverPath(filePath: string) {
  return filePath.replace(/\.[^/.]+$/, "");
}
