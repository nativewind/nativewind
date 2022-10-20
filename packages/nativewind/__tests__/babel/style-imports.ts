import pluginTester from "babel-plugin-tester";
import { styleImports } from "../../src/babel/plugins/style-imports";

process.env.NATIVEWIND_OUTPUT = "test-styles";

pluginTester({
  plugin: styleImports,
  pluginName: "style-imports",
  babelOptions: {
    filename: "nativewind/dist/index.js",
  },
  tests: [
    {
      code: `
      const a = 1;`,
      output: `
      import "test-styles";
      const a = 1;`,
    },
  ],
});
