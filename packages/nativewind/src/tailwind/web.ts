import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default function nativewindPreset() {
  const preset: Config = {
    content: [],
    theme: {},
    plugins: [
      plugin(function ({ addVariant }) {
        addVariant("web", "&");
      }),
    ],
  };
  return preset;
}
