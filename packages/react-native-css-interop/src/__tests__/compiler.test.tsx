import { cssToReactNativeRuntime } from "../css-to-rn";

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
    keyframes: [],
    rem: undefined,
    rootVariables: {},
    rules: {
      test: {
        $type: "StyleRuleSet",
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
    universalVariables: {},
  });
});
