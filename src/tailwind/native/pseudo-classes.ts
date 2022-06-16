import { CustomPluginFunction } from "./types";

export const pseudoClasses: CustomPluginFunction = ({ addVariant }) => {
  addVariant("hover", "&::hover");
  addVariant("focus", "&::focus");
  addVariant("active", "&::active");
};
