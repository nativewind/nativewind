import plugin from "tailwindcss/plugin";

export default plugin(function ({ addVariant }) {
  addVariant("web", "&");
  addVariant("parent", "& > *");
  addVariant("group-isolate-hover", "&.group-isolate-hover");
  addVariant("group-isolate-focus", "&.group-isolate-focus");
  addVariant("group-isolate-active", "&.group-isolate-active");
});
