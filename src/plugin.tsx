import plugin, { type PluginCreator } from "tailwindcss/plugin";

function kebabCase(str: string) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );
}

const nativewind: PluginCreator = plugin.withOptions(
  () =>
    ({ matchVariant }) => {
      matchVariant(
        "@map",
        (value = "", { modifier }) => {
          value = kebabCase(value.replace(/&/, "\\&"));

          if (modifier) {
            modifier = modifier.replace(/&/, "\\&");
          }

          /**
           Adding @media all is a hack for Tailwind CSS which has undocumented behavior
           If we do this `@nativeMapping { ...values } @slot;` it doesn't work, even if we
           wrap it like `& { @nativeMapping { ...values } @slot; }`

           Adding @slot duplicates the styles and it will try to add the styles into the @nativeMapping block

           By adding the `@media all`, Tailwind will add brackets and insert the styles correctly

           This does lead to weird looking CSS, but it works inside the browser and React Native
           */

          if (modifier && value) {
            // @nativeMapping-[value]/<modifier>:text-red-500
            // In this instance, we are moving value (the style nativeMapping) to the modifier (the target key)
            return `@nativeMapping { ${modifier}:${value} }; @media all`;
          } else if (modifier && !value) {
            // @nativeMapping/<modifier>:text-red-500
            // In this instance, we are moving the last style value to the modifier
            return `@nativeMapping ${modifier}; @media all`;
          } else if (!modifier && value) {
            return `@nativeMapping ${value}; @media all`;
          } else {
            return "";
          }
        },
        { values: { DEFAULT: undefined } },
      );
    },
);

export default nativewind;
