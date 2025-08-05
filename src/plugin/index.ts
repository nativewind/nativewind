import plugin, { type PluginCreator } from "tailwindcss/plugin";

function kebabCase(str: string) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );
}

console.log("Asdf");

const nativewind: PluginCreator = plugin.withOptions(
  () =>
    ({ matchVariant }) => {
      matchVariant(
        "@move",
        (value = "", { modifier }) => {
          value = kebabCase(value.replace(/&/, "\\&").replaceAll(".", "\\."));

          if (modifier) {
            modifier = modifier.replace(/&/, "\\&").replaceAll(".", "\\.");
          }

          if (modifier && !value) {
            value = modifier;
            modifier = null;
          }
          /**
           Adding @media all is a hack for Tailwind CSS which has undocumented behaviour
           If we do this `@prop { ...values } @slot;` it doesn't work, even if we
           wrap it like `& { @prop { ...values } @slot; }`

           Adding @slot duplicates the styles and it will try to add the styles into the @prop block

           By adding the `@media all`, Tailwind will add brackets and insert the styles correctly

           This does lead to weird looking CSS, but it works inside the browser and React Native
           */
          return `@prop { ${value}: ${modifier ?? value}} @media all`;
        },
        { values: { DEFAULT: undefined } },
      );
    },
);

export default nativewind;
