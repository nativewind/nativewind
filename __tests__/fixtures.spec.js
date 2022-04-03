import path from "path";
import pluginTester from "babel-plugin-tester";
import testPlugin from "../babel";

pluginTester({
  pluginName: "native-inline",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "native-inline-fixtures"),
  babelOptions: require("../babel.config.js"),
});

pluginTester({
  pluginName: "native-context",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "native-context-fixtures"),
  babelOptions: require("../babel.config.js"),
});

pluginTester({
  pluginName: "web",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "web-fixtures"),
  babelOptions: require("../babel.config.js"),
});
