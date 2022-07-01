import { join } from "node:path";
import pluginTester from "babel-plugin-tester";
import plugin from "../src/babel";

// eslint-disable-next-line unicorn/prefer-module
const fixtures = join(__dirname, "babel");

pluginTester({
  plugin,
  fixtures,
  pluginName: "nativewind",
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    cwd: fixtures,
  },
});
