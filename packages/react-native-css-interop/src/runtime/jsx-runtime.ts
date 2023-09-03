import ReactJSXRuntime from "react/jsx-runtime";
import { render } from "./render";
import { JSXFunction } from "../types";

export { Fragment } from "react";

export function jsx<P>(...args: Parameters<JSXFunction<P>>) {
  return render((ReactJSXRuntime as any).jsx, ...args);
}

export function jsxs<P>(...args: Parameters<JSXFunction<P>>) {
  return render((ReactJSXRuntime as any).jsxs, ...args);
}

export function jsxDEV<P>(...args: Parameters<JSXFunction<P>>) {
  return render((ReactJSXRuntime as any).jsxDEV, ...args);
}
