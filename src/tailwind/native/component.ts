import { CustomPluginFunction } from "./types";

export const component: CustomPluginFunction = ({ addVariant }) => {
  addVariant("component-hover", "@component hover");
  addVariant("component-focus", "@component focus");
  addVariant("component-active", "@component active");
};
