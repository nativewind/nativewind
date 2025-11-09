/**
 * JSX Runtime for Next.js 16
 * 
 * This file provides the jsx-dev-runtime export required by Next.js 16
 * when using jsxImportSource: "nativewind" in tsconfig.json
 * 
 * The className prop is automatically processed by react-native-css
 * when components are rendered, so we can use React's standard JSX runtime.
 */

// Re-export React's JSX runtime functions
// These are the functions that Next.js 16 expects when jsxImportSource is set
// In React 19, jsx is the default export and jsxs is the same as jsx
import * as jsxRuntime from "react/jsx-dev-runtime";

export const {
  jsxDEV,
  Fragment,
} = jsxRuntime;

// jsx is the default export in React 19, accessed via the namespace
// @ts-expect-error - default export exists at runtime but not in types
export const jsx = jsxRuntime.default || jsxRuntime;

// For compatibility with code that might use jsxs, we re-export jsx as jsxs
// In React 19, jsx and jsxs are the same function
export const jsxs = jsx;

