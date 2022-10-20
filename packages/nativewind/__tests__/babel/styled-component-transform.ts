import pluginTester from "babel-plugin-tester";
import { styledComponentTransform } from "../../src/babel/plugins/styled-component-transform";

pluginTester({
  plugin: styledComponentTransform,
  pluginName: "Babel: styled-component-transform",
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
  },
  tests: [
    {
      title: "basic",
      pluginOptions: {
        tailwindConfig: {
          content: ["App.ts"],
        },
      },
      babelOptions: {
        filename: "App.ts",
      },
      formatResult: (r) => r,
      code: `<View className="container"><Text /></View>`,
      output: `
      import { StyledComponent as _StyledComponent } from "nativewind";
      <_StyledComponent className="container" component={View}><Text /></_StyledComponent>;
    `,
    },
    {
      title: "preserve attributes",
      pluginOptions: {
        tailwindConfig: {
          content: ["App.ts"],
        },
      },
      babelOptions: {
        filename: "App.ts",
      },
      formatResult: (r) => r,
      code: `<View className={container} test style={styles.test}/>`,
      output: `
      import { StyledComponent as _StyledComponent } from "nativewind";
      <_StyledComponent className={container} test style={styles.test} component={View}></_StyledComponent>;
    `,
    },
  ],
});
