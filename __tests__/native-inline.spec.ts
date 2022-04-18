import { join } from "path";
import pluginTester from "babel-plugin-tester";
import testPlugin from "../src/babel";

const fixtures = join(__dirname, "native-inline");

pluginTester({
  pluginName: "native-inline",
  plugin: testPlugin,
  fixtures,
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    cwd: fixtures,
  },
  pluginOptions: {
    platform: "native-inline",
  },
});
