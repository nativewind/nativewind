import ReactJSXRuntime from "react/jsx-dev-runtime";
import { render } from "./render";

export { Fragment } from "react";

export function jsx(...args: any[]) {
  return render((ReactJSXRuntime as any).jsx, ...args);
}

export function jsxs(type: any, props: any, key: any) {
  return render((ReactJSXRuntime as any).jsxs, type, props, key);
}

export function jsxDEV(type: any, props: any, key: any) {
  return render((ReactJSXRuntime as any).jsxDEV, type, props, key);
}
