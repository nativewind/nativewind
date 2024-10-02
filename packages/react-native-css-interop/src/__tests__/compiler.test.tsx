import { cssToReactNativeRuntime } from "../css-to-rn";
import { StyleRuleSetSymbol } from "../shared";

test("will merge static styles", () => {
  const compiled = cssToReactNativeRuntime(`
    .test { 
      @rn-move backgroundColor test;
      color: red; 
      border-color: blue; 
      background-color: red;
    }
  `);

  expect(compiled).toStrictEqual({
    $compiled: true,
    flags: {},
    rem: undefined,
    rules: {
      test: {
        [StyleRuleSetSymbol]: true,
        normal: [
          {
            $type: "StyleRule",
            s: [1, 1],
            d: [
              [
                {
                  borderColor: "#0000ff",
                  color: "#ff0000",
                },
              ],
              ["#ff0000", ["test"]],
            ],
          },
        ],
      },
    },
  });
});
