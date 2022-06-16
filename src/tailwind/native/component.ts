import { CustomPluginFunction } from "./types";

export const component: CustomPluginFunction = ({ addVariant }) => {
  addVariant("group-scoped-hover", "&:group-scoped-hover");
  addVariant("group-scoped-active", "&:group-scoped-active");
  addVariant("group-scoped-focus", "&:group-scoped-focus");
};
