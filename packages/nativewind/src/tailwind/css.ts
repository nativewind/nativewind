import plugin from "tailwindcss/plugin";

export default plugin(function ({ addVariant }) {
  addVariant("web", "&");
  addVariant("parent", "& > *");
  addVariant("scope-group-hover", "&.scope-group-hover");
  addVariant("scope-group-focus", "&.scope-group-focus");
  addVariant("scope-group-active", "&.scope-group-active");
});
