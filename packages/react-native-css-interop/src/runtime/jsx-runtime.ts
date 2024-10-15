import { createElement as originalCreateElement } from "react";

import ReactJSXRuntime from "react/jsx-runtime";

import wrapJSX from "./wrap-jsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRuntime = ReactJSXRuntime as any;

/**
 * This the entry point for the react-native-css-interop runtime.
 * The babel plugin swaps the `jsxImportSource` to this module.
 * These functions need to be very light weight as they are the hottest function calls in a React application
 * @see https://babeljs.io/docs/babel-plugin-transform-react-jsx
 * @see https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#summary
 */
export { Fragment } from "react";
export const jsxs = wrapJSX(ReactRuntime.jsxs);
export const jsx = wrapJSX(ReactRuntime.jsx);
export const jsxDEV = wrapJSX(ReactRuntime.jsxDEV);
export const createInteropElement = wrapJSX(originalCreateElement);
export const createElement = originalCreateElement;
