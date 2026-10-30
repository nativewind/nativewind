import { withReactNativeCSS } from "react-native-css/metro";

import { withNativewind } from "../metro";

jest.mock("react-native-css/metro", () => ({
  withReactNativeCSS: jest.fn((config: unknown) => config),
}));

const mockWithReactNativeCSS = jest.mocked(withReactNativeCSS);

describe("withNativewind", () => {
  beforeEach(() => mockWithReactNativeCSS.mockClear());

  it("uses the defaults when no options are passed", () => {
    withNativewind({});

    expect(mockWithReactNativeCSS).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        globalClassNamePolyfill: true,
        typescriptEnvPath: "nativewind-env.d.ts",
      }),
    );
  });

  it("keeps the defaults when an option is passed as undefined", () => {
    withNativewind(
      {},
      { globalClassNamePolyfill: undefined, typescriptEnvPath: undefined },
    );

    expect(mockWithReactNativeCSS).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        globalClassNamePolyfill: true,
        typescriptEnvPath: "nativewind-env.d.ts",
      }),
    );
  });

  it("respects options that are set", () => {
    withNativewind(
      {},
      { globalClassNamePolyfill: false, typescriptEnvPath: "custom.d.ts" },
    );

    expect(mockWithReactNativeCSS).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        globalClassNamePolyfill: false,
        typescriptEnvPath: "custom.d.ts",
      }),
    );
  });
});
