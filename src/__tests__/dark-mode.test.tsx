import { Appearance, DeviceEventEmitter, StyleSheet } from "react-native";

import { act, renderHook, screen } from "@testing-library/react-native";
import * as Nativewind from "nativewind";
import * as CSS from "react-native-css";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

// The Expo preset otherwise replaces this hook with a constant light value.
jest.unmock("react-native/Libraries/Utilities/useColorScheme");

// Mock only the native Appearance module. Keep React Native's Appearance event
// bridge and the engine's subscription real. Device tests verify OS delivery.
jest.mock("react-native/Libraries/Utilities/NativeAppearance", () => ({
  __esModule: true,
  default: {
    getColorScheme: jest.fn(() => "light"),
    setColorScheme: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}));

const systemChange = (colorScheme: "light" | "dark") => {
  act(() => {
    DeviceEventEmitter.emit("appearanceChanged", { colorScheme });
  });
};

const manuallySelect = (colorScheme: "light" | "dark" | "unspecified") => {
  act(() => {
    Appearance.setColorScheme(colorScheme);
    // React Native receives this event from the OS after an override changes.
    DeviceEventEmitter.emit("appearanceChanged", {
      colorScheme: colorScheme === "unspecified" ? "light" : colorScheme,
    });
  });
};

test("public runtime exports use the installed CSS engine", () => {
  for (const name of [
    "styled",
    "useCssElement",
    "useUnstableNativeVariable",
    "vars",
    "VariableContextProvider",
  ] as const) {
    expect(Nativewind[name]).toBe(CSS[name]);
  }
});

test("the deprecated color scheme hook delegates to Appearance", () => {
  // The deprecated public wrapper remains compatible during migration.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const hook = renderHook(() => Nativewind.useColorScheme());
  const setter = jest.spyOn(Appearance, "setColorScheme");
  try {
    for (const scheme of ["light", "dark"] as const) {
      systemChange(scheme);
      expect(hook.result.current.colorScheme).toBe(scheme);
      act(() => {
        hook.result.current.toggleColorScheme();
      });
      expect(setter).toHaveBeenLastCalledWith(
        scheme === "dark" ? "light" : "dark",
      );
    }
    act(() => {
      hook.result.current.setColorScheme("unspecified");
    });
    expect(setter).toHaveBeenLastCalledWith("unspecified");
  } finally {
    setter.mockRestore();
    hook.unmount();
  }
});

test.each([false, true])(
  "documented dark variant follows Appearance with optimization %s",
  async (optimize) => {
    await render(<View testID="theme" className="bg-white dark:bg-black" />, {
      optimize,
      sourceFile: '<View className="bg-white dark:bg-black" />',
    });
    const background = () =>
      (
        StyleSheet.flatten(screen.getByTestId("theme").props.style) as {
          backgroundColor?: string;
        }
      ).backgroundColor;
    systemChange("light");
    expect(background()).toBe("#fff");
    systemChange("dark");
    expect(background()).toBe("#000");
    manuallySelect("light");
    expect(Appearance.getColorScheme()).toBe("light");
    expect(background()).toBe("#fff");
    manuallySelect("dark");
    expect(background()).toBe("#000");
    manuallySelect("unspecified");
    expect(background()).toBe("#fff");
    systemChange("dark");
    expect(background()).toBe("#000");
  },
);
