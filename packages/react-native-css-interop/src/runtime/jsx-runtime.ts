import ReactJSXRuntime from "react/jsx-runtime";
import wrapJSX from "./wrap-jsx";

export { Fragment } from "react";
export const jsxs = wrapJSX((ReactJSXRuntime as any).jsxs);
export const jsx = wrapJSX((ReactJSXRuntime as any).jsx);
