import { Appearance, DeviceEventEmitter, StyleSheet } from "react-native";

import { act, screen } from "@testing-library/react-native";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

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
