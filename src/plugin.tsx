import plugin, { type PluginCreator } from "tailwindcss/plugin";

function kebabCase(str: string) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );
}

const nativewind: PluginCreator = plugin.withOptions(() => (api) => {
  api.matchVariant(
    "@map",
    (value = "", { modifier }) => {
      value = kebabCase(value.replace(/&/, "\\&"));

      if (modifier) {
        modifier = modifier.replace(/&/, "\\&");
      }

      // Keep mapping metadata in the declaration block through CSS optimization.
      const target = modifier && !value ? modifier : value;
      const source = modifier && value ? kebabCase(modifier) : "*";
      const property =
        source === "*" ? "-rn-native-mapping" : `-rn-native-mapping-${source}`;
      // matchVariant inserts its slot into the final selector inside the block.
      return target ? `& { ${property}: ${target}; & }` : "";
    },
    { values: { DEFAULT: undefined } },
  );
});

export default nativewind;
