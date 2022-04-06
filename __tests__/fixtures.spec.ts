import path from "path";
import pluginTester from "babel-plugin-tester";
import testPlugin from "../src/babel";

const babelOptions = {
  plugins: ["@babel/plugin-syntax-jsx"],
};

pluginTester({
  pluginName: "native-inline",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "native-inline-fixtures"),
  babelOptions,
});

pluginTester({
  pluginName: "native-context",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "native-context-fixtures"),
  babelOptions,
});

pluginTester({
  pluginName: "web",
  plugin: testPlugin,
  fixtures: path.join(__dirname, "web-fixtures"),
  babelOptions,
});
