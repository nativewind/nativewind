/**
 * Babel plugin stub for NativeWind v5
 * 
 * NativeWind v5 does not require a Babel plugin - it works via JSX transform and Metro configuration only.
 * This file exists only for backward compatibility with tools that may try to automatically
 * resolve 'nativewind/babel' (e.g., babel-preset-expo).
 * 
 * The plugin is a no-op (no operation) and does nothing when loaded.
 * 
 * @see https://www.nativewind.dev/v5
 */

import type { PluginObj } from "@babel/core";

/**
 * No-op Babel plugin for NativeWind v5
 * 
 * This plugin does nothing and exists only for compatibility.
 * NativeWind v5 uses JSX transform and Metro configuration instead of Babel.
 * 
 * @returns A Babel plugin object that performs no transformations
 */
export default function (): PluginObj {
  return {
    name: "nativewind-babel-stub",
    visitor: {
      // No-op: this plugin intentionally does nothing
    },
  };
}

