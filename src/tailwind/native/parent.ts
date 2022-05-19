import { CustomPluginFunction } from "./types";

export const parent: CustomPluginFunction = ({ addVariant }) => {
  addVariant("parent", "@selector (> *)");
};
