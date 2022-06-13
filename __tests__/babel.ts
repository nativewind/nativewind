import { join } from "node:path";
import pluginTester from "babel-plugin-tester";
import plugin from "../src/babel";

const fixtures = join(__dirname, "babel");

pluginTester({
  plugin,
  fixtures,
  pluginName: "tailwindcss-react-native",
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    cwd: fixtures,
  },
});
