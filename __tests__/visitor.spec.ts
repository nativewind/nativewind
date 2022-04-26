import { join } from "node:path";
import pluginTester from "babel-plugin-tester";
import plugin from "../src/babel";

const fixtures = join(__dirname, "visitor");

pluginTester({
  plugin,
  fixtures,
  pluginName: "visitor",
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    cwd: fixtures,
  },
});
