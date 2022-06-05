import postcss, { PluginCreator } from "postcss";
import calc from "postcss-calc";
import postcssCssVariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";
import postcssNested from "postcss-nested";

import plugin, { PostcssPluginOptions } from "./plugin";

const pluginPack: PluginCreator<PostcssPluginOptions> = (options) => {
  return postcss([
    postcssCssVariables(),
    postcssColorFunctionalNotation(),
    calc({
      warnWhenCannotResolve: true,
    }),
    postcssNested({ bubble: ["selector", "pseudo-class", "dynamic-style"] }),
    plugin(options),
  ]);
};

pluginPack.postcss = true;

export default pluginPack;
