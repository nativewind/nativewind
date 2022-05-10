import postcss, { PluginCreator } from "postcss";
import calc from "postcss-calc";
import postcssCssvariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

import plugin, { PostcssPluginOptions } from "./plugin";

const pluginPack: PluginCreator<PostcssPluginOptions> = (options) => {
  return postcss([
    postcssCssvariables(),
    postcssColorFunctionalNotation(),
    calc({
      warnWhenCannotResolve: true,
    }),
    plugin(options),
  ]);
};

pluginPack.postcss = true;

export default pluginPack;
