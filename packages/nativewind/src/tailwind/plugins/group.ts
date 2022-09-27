import plugin from "tailwindcss/plugin";

export const group = plugin(function ({ addVariant }) {
  addVariant("group-hover", "&:group-hover");
  addVariant("group-active", "&:group-active");
  addVariant("group-focus", "&:group-focus");
});
