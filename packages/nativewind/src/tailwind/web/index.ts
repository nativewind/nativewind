import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const preset: Config = {
  nativewind: true,
  content: [],
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("web", "&");
    }),
  ],
};

export default preset;
