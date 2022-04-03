const web = require("./web");
const native = require("./native");

const platformPlugins = {
  web,
  native,
  "native-context": native,
  "native-inline": native,
};

const convertClassNameIntoTailwindStyles = (...args) => {
  const [, { platform = "native" }] = args;
  return platformPlugins[platform](...args);
};

module.exports = convertClassNameIntoTailwindStyles;
