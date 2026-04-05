import { Appearance, AppState, Platform } from "react-native";

import { colorScheme } from "test";

import { systemColorScheme } from "../runtime/native/appearance-observables";
import { INTERNAL_RESET } from "../shared";

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

describe("appearance listener filters unspecified", () => {
  let addChangeListenerSpy: jest.SpyInstance;
  let addAppStateListenerSpy: jest.SpyInstance;
  let appearanceCallback: (state: { colorScheme: string | null }) => void;
  let appStateCallback: (state: string) => void;

  beforeEach(() => {
    // Capture the callbacks registered by resetAppearanceListeners
    addChangeListenerSpy = jest
      .spyOn(Appearance, "addChangeListener")
      .mockImplementation((cb: any) => {
        appearanceCallback = cb;
        return { remove: jest.fn() } as any;
      });

    addAppStateListenerSpy = jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_type: string, cb: any) => {
        appStateCallback = cb;
        return { remove: jest.fn() } as any;
      });

    // Reset to re-register listeners with our spies
    colorScheme[INTERNAL_RESET](Appearance);
  });

  afterEach(() => {
    addChangeListenerSpy.mockRestore();
    addAppStateListenerSpy.mockRestore();
  });

  test('filters "unspecified" from Appearance change listener', () => {
    // Set a known scheme first
    systemColorScheme.set("dark");

    // Simulate RN emitting "unspecified" during a transition
    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
    });
    appearanceCallback({ colorScheme: "unspecified" });

    // Should keep the previous value, not "unspecified"
    expect(systemColorScheme.get()).toBe("dark");
  });

  test('filters "unspecified" from AppState resume listener', () => {
    // Set a known scheme first
    systemColorScheme.set("dark");

    // Simulate getColorScheme returning "unspecified" on resume
    const getColorSchemeSpy = jest
      .spyOn(Appearance, "getColorScheme")
      .mockReturnValue("unspecified" as any);

    appStateCallback("active");

    // Should keep the previous value, not "unspecified"
    expect(systemColorScheme.get()).toBe("dark");

    getColorSchemeSpy.mockRestore();
  });

  test("passes through valid light/dark from Appearance listener", () => {
    systemColorScheme.set("light");

    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
    });
    appearanceCallback({ colorScheme: "dark" });

    expect(systemColorScheme.get()).toBe("dark");
  });

  test("passes through valid light/dark from AppState listener", () => {
    systemColorScheme.set("light");

    const getColorSchemeSpy = jest
      .spyOn(Appearance, "getColorScheme")
      .mockReturnValue("dark");

    appStateCallback("active");

    expect(systemColorScheme.get()).toBe("dark");

    getColorSchemeSpy.mockRestore();
  });

  test("falls back to current scheme when null is received", () => {
    systemColorScheme.set("light");

    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
    });
    appearanceCallback({ colorScheme: null });

    expect(systemColorScheme.get()).toBe("light");
  });
});
