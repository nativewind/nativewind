import { Appearance, Platform } from "react-native";

import { colorScheme } from "test";

describe("colorScheme.set", () => {
  let setColorSchemeSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock the implementation to avoid RN's built-in validation,
    // which doesn't know about "unspecified" in older RN versions
    setColorSchemeSpy = jest
      .spyOn(Appearance, "setColorScheme")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    setColorSchemeSpy.mockRestore();
  });

  test('passes "unspecified" to Appearance.setColorScheme on RN 0.82+', () => {
    const original = Platform.constants.reactNativeVersion;
    (Platform.constants as any).reactNativeVersion = { ...original, minor: 82 };

    try {
      colorScheme.set("system");
      expect(setColorSchemeSpy).toHaveBeenCalledWith("unspecified");
    } finally {
      (Platform.constants as any).reactNativeVersion = original;
    }
  });

  test("passes null to Appearance.setColorScheme on RN < 0.82", () => {
    const original = Platform.constants.reactNativeVersion;
    (Platform.constants as any).reactNativeVersion = { ...original, minor: 81 };

    try {
      colorScheme.set("system");
      expect(setColorSchemeSpy).toHaveBeenCalledWith(null);
    } finally {
      (Platform.constants as any).reactNativeVersion = original;
    }
  });

  test("passes value directly for light/dark", () => {
    colorScheme.set("dark");
    expect(setColorSchemeSpy).toHaveBeenCalledWith("dark");

    setColorSchemeSpy.mockClear();

    colorScheme.set("light");
    expect(setColorSchemeSpy).toHaveBeenCalledWith("light");
  });
});
