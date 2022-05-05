import postcss, { PluginCreator } from "postcss";
import calc from "postcss-calc";
import postcssCssvariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

import plugin, { PostcssPluginOptions } from "./plugin";

const pluginPack: PluginCreator<PostcssPluginOptions> = (options) => {
  return postcss([
    postcssCssvariables({
      variables: {
        "tw-translate-x": 0,
        "tw-translate-y": 0,
        "tw-rotate": "0deg",
        "tw-skew-x": "0deg",
        "tw-skew-y": "0deg",
        "tw-scale-x": 0,
        "tw-scale-y": 0,
      },
    }),
    postcssColorFunctionalNotation(),
    calc({
      warnWhenCannotResolve: true,
    }),
    plugin(options),
  ]);
};

pluginPack.postcss = true;

export default pluginPack;
