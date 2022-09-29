import plugin from "tailwindcss/plugin";

export const scopedGroup = plugin(function ({ addVariant }) {
  addVariant("scoped-group-hover", "&:scoped-group-hover");
  addVariant("scoped-group-active", "&:scoped-group-active");
  addVariant("scoped-group-focus", "&:scoped-group-focus");
});
