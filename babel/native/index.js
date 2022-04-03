const contextPlugin = require("./context");
const inlinePlugin = require("./inline");

const convertClassNameIntoTailwindStyles = (babelConfig, pluginConfig, cwd) => {
  const { platform } = pluginConfig;
  return platform === "native-context" || process.env.NODE_ENV === "production"
    ? contextPlugin(babelConfig, pluginConfig, cwd)
    : inlinePlugin(babelConfig, pluginConfig, cwd);
};

module.exports = convertClassNameIntoTailwindStyles;
