import { isDeepEqual } from "../util/isDeepEqual";

test("a", () => {
  const a = [
    {
      $type: "StyleRule",
      s: [14215, 2],
      d: [[[{}, "var", ["--theme-fg", null], true], "color", true]],
      pseudoClasses: {
        active: true,
      },
      attrs: [],
    },
  ];

  const b = [
    {
      $type: "StyleRule",
      s: [14215, 2],
      d: [[[{}, "var", ["--theme-fg", null], true], "color", true]],
      pseudoClasses: {
        active: true,
      },
      attrs: [],
    },
  ];

  expect(isDeepEqual(a, b)).toBeTruthy();
});
