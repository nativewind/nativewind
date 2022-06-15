import { CustomPluginFunction } from "./types";

export const component: CustomPluginFunction = ({ addVariant }) => {
  addVariant("group-scoped-hover", "@scoped-group hover");
  addVariant("group-scoped-focus", "@scoped-group focus");
  addVariant("group-scoped-active", "@scoped-group active");
};
