import { join } from "node:path";
import pluginTester from "babel-plugin-tester";
import testPlugin from "../src/babel";

const fixtures = join(__dirname, "native-context");

pluginTester({
  pluginName: "native-context",
  plugin: testPlugin,
  fixtures,
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    cwd: fixtures,
  },
  pluginOptions: {
    platform: "native-context",
  },
});
