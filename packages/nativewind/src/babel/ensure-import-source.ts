import { PluginObj } from "@babel/core";

interface JSXPluginConfig {
  importSource?: string;
}

interface State {
  opts: {
    plugins: [string, JSXPluginConfig][];
    importSource?: string;
  };
}

export default function nativewindImportSourceCheckPlugin(): PluginObj<State> {
  return {
    visitor: {
      Program(_: unknown, state: State) {
        const jsxPlugin = state.opts.plugins.find(
          ([name]) => name === "@babel/plugin-transform-react-jsx",
        );

        if (!jsxPlugin || jsxPlugin[1]?.importSource !== "nativewind") {
          throw new Error(`NativeWind requires the jsx importSource to be set to \`nativewind\`. Please add the following code to the end of your babel plugin array:
["@babel/plugin-transform-react-jsx", { runtime: "automatic", importSource: "nativewind" }]`);
        }
      },
    },
  };
}
