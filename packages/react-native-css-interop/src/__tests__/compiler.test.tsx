import { cssToReactNativeRuntime } from "../css-to-rn";
import { StyleRuleSetSymbol, StyleRuleSymbol } from "../shared";

test("will merge static styles", () => {
  const compiled = cssToReactNativeRuntime(`
    .test { 
      @rn-move backgroundColor test;
      color: red; 
      border-color: blue; 
      background-color: red;
      --test: 1;
      border-color: var(--test)
    }
  `);

  expect(compiled).toStrictEqual({
    $compiled: true,
    flags: {},
    rem: undefined,
    rules: {
      test: {
        [StyleRuleSetSymbol]: true,
        variables: true,
        n: [
          {
            [StyleRuleSymbol]: true,
            s: [1, 1],
            d: [
              [
                {
                  borderColor: "#0000ff",
                  color: "#ff0000",
                },
              ],
              ["#ff0000", ["test"]],
              [[{}, "var", ["--test"], 1], "borderColor", 1],
            ],
            variables: [["--test", 1]],
          },
        ],
      },
    },
  });
});
