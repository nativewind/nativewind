/**
 * Metro configuration for NativeWind v5
 * 
 * This file provides the withNativeWind function for configuring Metro bundler.
 * It wraps react-native-css's withReactNativeCSS function and adds Windows ESM compatibility.
 */

import { withReactNativeCSS } from "react-native-css/metro";
import type { InputConfigT } from "metro-config";

/**
 * Configure Metro bundler for NativeWind v5
 * 
 * This function wraps react-native-css's withReactNativeCSS and provides
 * Windows ESM compatibility by ensuring file paths are properly handled.
 * 
 * @param config - Metro configuration object or function
 * @param options - NativeWind configuration options
 * @returns Configured Metro config
 * 
 * @example
 * ```js
 * const { getDefaultConfig } = require("@react-native/metro-config");
 * const { withNativeWind } = require("nativewind/metro");
 * 
 * const config = getDefaultConfig(__dirname);
 * module.exports = withNativeWind(config, { input: "./global.css" });
 * ```
 */
export function withNativeWind(
  config: InputConfigT | (() => InputConfigT | Promise<InputConfigT>),
  options?: {
    input?: string;
    disableTypeScriptGeneration?: boolean;
    typescriptEnvPath?: string;
    globalClassNamePolyfill?: boolean;
    logger?: any;
  }
): InputConfigT | (() => Promise<InputConfigT>) {
  // On Windows, ensure file paths are properly handled for ESM
  // This fixes Issue #1667: ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows
  if (process.platform === "win32" && options?.input) {
    // Convert Windows path to proper format if needed
    // The actual path handling is done by react-native-css, but we ensure
    // the input path is normalized
    const path = require("node:path");
    const normalizedInput = path.resolve(options.input);
    options = {
      ...options,
      input: normalizedInput,
    };
  }

  // Type assertion needed because withReactNativeCSS expects a specific function signature
  return withReactNativeCSS(config as any, options);
}

// Also export as withNativewind for backward compatibility
export { withNativeWind as withNativewind };

