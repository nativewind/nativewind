import { CustomPluginFunction } from "./types";

export const dark: CustomPluginFunction = ({ addVariant }) => {
  addVariant("dark", "&::dark");
};
