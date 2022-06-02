import React, { createContext, PropsWithChildren, useContext } from "react";
import { Platform } from "react-native";

export interface PlatformContext {
  preview: boolean;
  platform: string;
}

const PlatformContext = createContext<PlatformContext>({
  preview: false,
  platform: "",
});

export function PlatformProvider({
  preview = false,
  platform = Platform.OS,
  ...props
}: PropsWithChildren<Partial<PlatformContext>>) {
  return <PlatformContext.Provider value={{ preview, platform }} {...props} />;
}

export function usePlatform() {
  const context = useContext(PlatformContext);

  if (!context.platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  return context;
}
