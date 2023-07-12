import {
  createMockComponent,
  resetStyles,
} from "react-native-css-interop/testing-library";
import { renderTailwind } from "../test-utils";

const warning = (name: string) => {
  return {
    failure: {
      warnings: [
        `${name} is only valid on web. Please use within a media query to avoid confusion.`,
      ],
    },
  };
};

const cases = [
  ["z-0", { success: { zIndex: 0 } }],
  // ["z-auto", warning("z-auto")],
] as const;

const A = createMockComponent();

afterEach(() => resetStyles());

test.each(cases)("%s", (className, expected) => {
  renderTailwind(<A className={className} />);

  if ("success" in expected && "failure" in expected) {
    expect(A).styleToEqual(expected);
  } else if ("success" in expected) {
    expect(A).styleToEqual(expected);
  } else if ("failure" in expected) {
    expect(A).styleToEqual({});
  } else {
    console.error(`Invalid test for ${className}`);
  }
});
