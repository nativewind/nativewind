import { createElement as ce } from "react";
import ReactJSXRuntime from "react/jsx-dev-runtime";
import wrapJSX from "./wrap-jsx";

export { Fragment } from "react";
export const jsxs = wrapJSX((ReactJSXRuntime as any).jsxs);
export const jsx = wrapJSX((ReactJSXRuntime as any).jsx);
export const jsxDEV = wrapJSX((ReactJSXRuntime as any).jsxDEV);
export const createInteropElement = wrapJSX(ce as any);
export const createElement = wrapJSX(ce as any);
