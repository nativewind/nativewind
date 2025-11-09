/**
 * Compatibility helpers for migrating from NativeWind v4 to v5
 * 
 * This file provides helper functions to ease the migration from v4 to v5,
 * particularly for cases where react-native-css doesn't fully support
 * all v4 features yet.
 */

import { styled as rnStyled } from "react-native-css";
import type { ComponentType } from "react";

/**
 * Compatibility wrapper for cssInterop → styled migration
 * 
 * This function provides a similar API to v4's cssInterop while using
 * v5's styled function. Note that nativeStyleToProp may not work
 * until react-native-css adds full support (Issue #1675).
 * 
 * @example
 * ```tsx
 * import { cssInterop } from 'nativewind/compat';
 * 
 * cssInterop(Icon, {
 *   className: {
 *     target: 'style',
 *     nativeStyleToProp: {
 *       height: 'size',
 *       width: 'size',
 *     },
 *   },
 * });
 * ```
 */
export function cssInterop<Props extends Record<string, any>>(
  component: ComponentType<Props>,
  config: {
    className?: {
      target?: string;
      nativeStyleToProp?: Record<string, string>;
    };
  }
): ComponentType<Props> {
  // Use styled from react-native-css
  // Note: nativeStyleToProp support depends on react-native-css
  // See Issue #1675 for details
  return rnStyled(component, config as any) as ComponentType<Props>;
}

/**
 * Helper to merge className and style props
 * 
 * Workaround for Issue #1647: className and style cannot be used together
 * 
 * @example
 * ```tsx
 * import { mergeStyles } from 'nativewind/compat';
 * 
 * <View {...mergeStyles("bg-blue-500", { padding: 10 })} />
 * ```
 */
export function mergeStyles(
  className?: string,
  style?: Record<string, any>
): { className?: string; style?: Record<string, any> } {
  // Workaround: Use only className if both are provided
  // This is a temporary solution until react-native-css fixes Issue #1647
  if (className && style) {
    console.warn(
      "NativeWind v5: className and style cannot be used together (Issue #1647). " +
      "Using className only. Consider converting style props to Tailwind classes."
    );
    return { className };
  }
  
  return { className, style };
}

