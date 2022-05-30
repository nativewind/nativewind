import { CustomPluginFunction } from "./types";

export const parent: CustomPluginFunction = ({ addVariant }) => {
  addVariant("parent", "@selector (> *)");

  addVariant("parent-hover", "@parent hover");
  addVariant("parent-focus", "@parent focus");
  addVariant("parent-active", "@parent active");
};
