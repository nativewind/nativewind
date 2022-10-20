import pluginTester from "babel-plugin-tester";
import { removeCSS } from "../../src/babel/plugins/remove-css";

pluginTester({
  plugin: removeCSS,
  pluginName: "remove-css",
  tests: [
    {
      code: `
      const a = 1;
      require("./styles.css");
      const b = 1;`,
      output: `
      const a = 1;
      const b = 1;`,
    },
  ],
});
