import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { vars } from "../runtime";
import { calc } from "../runtime/native/resolve-value";
import { PropState } from "../runtime/native/native-interop";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

function getState(variables = {}): PropState {
  return {
    upgrades: {},
    interaction: {},
    tracking: {
      changed: false,
      index: 0,
      rules: [],
    },
    declarationEffect: {
      dependencies: new Set(),
      rerun() {},
    },
    styleEffect: {
      dependencies: new Set(),
      rerun() {},
    },
    refs: { props: {}, containers: {}, variables },
    sharedValues: new Map(),
    animationNames: new Set(),
    target: "style",
    source: "style",
  };
}

beforeEach(() => resetStyles());

test("1 + 1", () => {
  expect(calc(getState(), [1, "+", 1], {})).toBe(2);
});

test("1 - 1", () => {
  expect(calc(getState(), [1, "-", 1], {})).toBe(0);
});

test("2 * 2", () => {
  expect(calc(getState(), [2, "*", 2], {})).toBe(4);
});

test("2 / 2", () => {
  expect(calc(getState(), [2, "/", 2], {})).toBe(1);
});

test("1 + 5 / 2", () => {
  expect(calc(getState(), [1, "+", 5, "/", 2], {})).toBe(3.5);
});

test("(1 + 5) / 2", () => {
  expect(calc(getState(), ["(", 1, "+", 5, ")", "/", 2], {})).toBe(3);
});

test("var(--number) + 1", () => {
  expect(
    calc(
      getState({
        "--number": "2px",
      }),
      [
        {
          name: "var",
          arguments: ["--number"],
        },
        "+",
        1,
      ],
      {},
    ),
  ).toBe(3);
});

test("var(--percent) + 10%", () => {
  expect(
    calc(
      getState({
        "--percent": "20%",
      }),
      [
        {
          name: "var",
          arguments: ["--percent"],
        },
        "+",
        "10%",
      ],
      {},
    ),
  ).toBe("30%");
});

describe("css", () => {
  test("calc(10px + 100px)", () => {
    registerCSS(
      `.my-class {
        width: calc(10px + 100px);
      }`,
    );

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 110,
    });
  });

  test("calc(100% - 30px)", () => {
    // React Native does not support calc() with a percentage value, so this should be `undefined`
    registerCSS(
      `.my-class {
        width: calc(100% - 30px);
      }`,
    );

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle(undefined);
  });

  test("calc(2em * 3)", () => {
    registerCSS(
      `.my-class {
        width: calc(2em * 2);
        font-size: 5px

      }`,
    );

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 20,
      fontSize: 5,
    });
  });

  test("calc(2rem * 5)", () => {
    registerCSS(
      `.my-class {
        width: calc(2rem * 5)
      }`,
    );

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 140,
    });
  });

  test("calc(var(--variable) + 20px)", () => {
    registerCSS(
      `.my-class {
        width: calc(var(--variable) + 20px)
      }`,
    );

    const component = render(
      <A
        testID={testID}
        className="my-class"
        style={vars({
          "--variable": "100px",
        })}
      />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 120,
    });
  });

  test("calc(var(--percent) + 20%)", () => {
    registerCSS(
      `.my-class {
        width: calc(var(--percent) + 20%)
      }`,
    );

    const component = render(
      <A
        testID={testID}
        className="my-class"
        style={vars({
          "--percent": "10%",
        })}
      />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: "30%",
    });
  });
});

test("calc & colors", () => {
  registerCSS(
    `.my-class {
        background-color: hsl(
          calc(var(--H) + 20),
          calc(var(--S) - 10%),
          calc(var(--L) + 30%)
        )
      }`,
  );

  const component = render(
    <A
      testID={testID}
      className="my-class"
      style={vars({
        "--H": 100,
        "--S": "100%",
        "--L": "50%",
      })}
    />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    backgroundColor: "hsl(120, 90%, 80%)",
  });
});
