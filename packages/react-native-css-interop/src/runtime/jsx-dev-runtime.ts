import ReactJSXRuntime from "react/jsx-dev-runtime";
export { Fragment } from "react";

export function jsx(type: any, props: any, ...args: any) {
  return require("./components/rendering").render(
    (ReactJSXRuntime as any).jsx,
    type,
    props,
    ...args,
  );
}

export function jsxs(type: any, props: any, ...args: any) {
  return require("./components/rendering").render(
    (ReactJSXRuntime as any).jsxs,
    type,
    props,
    ...args,
  );
}

export function jsxDEV(type: any, props: any, ...args: any) {
  return require("./components/rendering").render(
    (ReactJSXRuntime as any).jsxDEV,
    type,
    props,
    ...args,
  );
}
