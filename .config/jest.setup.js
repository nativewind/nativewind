import { setUpTests } from "react-native-reanimated";

/* global jest */

// Worklets 0.10 requires its native implementation to be mocked in Jest.
jest.mock("react-native-worklets", () =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Jest returns the untyped Worklets mock module.
  jest.requireActual("react-native-worklets/src/mock"),
);

setUpTests();
