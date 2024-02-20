import { style, testCases } from "../test-utils";

describe.skip("Custom - Elevation", () => {
  testCases(
    [
      "elevation",
      style({
        elevation: 3,
      }),
    ],
    [
      "elevation-sm",
      style({
        elevation: 1,
      }),
    ],
  );
});
