import ReactJSXRuntime from "react/jsx-dev-runtime";
import wrapJSX from "./wrap-jsx";

export { Fragment } from "react";
export const jsxs = wrapJSX((ReactJSXRuntime as any).jsxs);
export const jsx = wrapJSX((ReactJSXRuntime as any).jsx);
