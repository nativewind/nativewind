import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const preset: Config = {
  nativewind: true,
  content: [],
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("web", "&");
      addVariant("parent", "& > *");
      addVariant("scope-group-hover", "&.scope-group-hover");
      addVariant("scope-group-focus", "&.scope-group-focus");
      addVariant("scope-group-active", "&.scope-group-active");
    }),
  ],
};

export default preset;
