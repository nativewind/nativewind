import { CustomPluginFunction } from "./types";

export const pseudoClasses: CustomPluginFunction = ({ addVariant }) => {
  addVariant("hover", "@pseudo-class hover");
  addVariant("focus", "@pseudo-class focus");
  addVariant("active", "@pseudo-class active");
};
