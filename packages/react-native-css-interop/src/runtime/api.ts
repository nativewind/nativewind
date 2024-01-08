import { ComponentType } from "react";
import { CssInterop, NormalizedOptions } from "../types";
import { getNormalizeConfig } from "./config";

export const interopComponents = new Map<object | string, NormalizedOptions>();

export const cssInterop: CssInterop = (component, mapping) => {
  interopComponents.set(component, getNormalizeConfig(mapping));
  return component as ComponentType<any>;
};
// On web, these are the same
export const remapProps = cssInterop;
