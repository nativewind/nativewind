import postcss, { PluginCreator } from "postcss";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

const postcssPluginPack: PluginCreator<never> = () => {
  return postcss([postcssColorFunctionalNotation()]);
};

postcssPluginPack.postcss = true;

export default postcssPluginPack;
