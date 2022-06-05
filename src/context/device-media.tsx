import React, { createContext, PropsWithChildren, useContext } from "react";
import { useWindowDimensions } from "react-native";
import { useDeviceOrientation } from "./use-device-orientation";

export interface DeviceMediaContext {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
}

const DeviceMediaContext = createContext<DeviceMediaContext>({
  width: 0,
  height: 0,
  orientation: "portrait",
});

export function DeviceMediaProvider(props: PropsWithChildren<unknown>) {
  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo() // We should support this
  const { width, height } = useWindowDimensions();
  const orientation: DeviceMediaContext["orientation"] = useDeviceOrientation()
    .portrait
    ? "portrait"
    : "landscape";
  return (
    <DeviceMediaContext.Provider
      value={{
        width,
        height,
        orientation,
      }}
      {...props}
    />
  );
}

export function useDeviceMedia() {
  return useContext(DeviceMediaContext);
}
