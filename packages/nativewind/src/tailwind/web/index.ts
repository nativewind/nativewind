import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const unsupportedVariants = ["ios", "android", "windows", "macos", "native"];

export default function nativewindPreset() {
  const preset: Config = {
    content: [],
    theme: {
      nativewind: true,
    },
    plugins: [
      plugin(function ({ addVariant }) {
        addVariant("web", "&");

        // Your editors intellisense loads the web plugin
        // so we need to include the native only variants
        // unfortunately this means they are preset in the production CSS
        // but putting them inside an invalid media-query means they won't
        // be used
        for (const variant of unsupportedVariants) {
          addVariant(variant, "@media unsupported");
        }
      }),
    ],
  };
  return preset;
}
