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

test("box-shadow does not fall through into aspect-ratio", () => {
  const compiled = cssToReactNativeRuntime(`
    .test {
      box-shadow: 0 0 4px red;
      aspect-ratio: 16 / 9;
    }
  `);

  const [[declarations]] = (compiled.rules.test as any).n[0].d;

  expect(declarations).toStrictEqual({
    shadowColor: "#ff0000",
    shadowRadius: 0,
    aspectRatio: "16 / 9",
  });
});

test("box-shadow alone does not crash", () => {
  expect(() =>
    cssToReactNativeRuntime(`
      .test {
        box-shadow: 0 0 4px red;
      }
    `),
  ).not.toThrow();
});
