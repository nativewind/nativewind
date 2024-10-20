import { createElement as originalCreateElement } from "react";

import ReactJSXRuntime from "react/jsx-dev-runtime";

import wrapJSX from "./wrap-jsx";

/**
 * This the entry point for the react-native-css-interop runtime.
 * The babel plugin swaps the `jsxImportSource` to this module.
 * These functions need to be very light weight as they are the hottest function calls in a React application
 * @see https://babeljs.io/docs/babel-plugin-transform-react-jsx
 * @see https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#summary
 */
export { Fragment } from "react";
export const jsxs = wrapJSX((ReactJSXRuntime as any).jsxs);
export const jsx = wrapJSX((ReactJSXRuntime as any).jsx);
export const jsxDEV = wrapJSX((ReactJSXRuntime as any).jsxDEV);
export const createInteropElement = wrapJSX(originalCreateElement as any);
export const createElement = originalCreateElement;
