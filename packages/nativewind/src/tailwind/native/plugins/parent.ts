import plugin from "tailwindcss/plugin";

export const parent = plugin(function ({ addVariant }) {
  addVariant("parent", "&:merge(:parent)");

  addVariant("parent-hover", "&:parent-hover");
  addVariant("parent-focus", "&:parent-focus");
  addVariant("parent-active", "&:parent-active");
});
