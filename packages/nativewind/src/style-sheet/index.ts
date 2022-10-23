import { ColorSchemeName, ColorValue, Dimensions } from "react-native";
import type { AtomRecord, VariableValue } from "../transform-css/types";

export * from "./web";

export declare function useVariable<
  T extends string | number | ColorValue | undefined
>(name: `--${string}`): [T, (value: T) => void];

export interface NativeWindStyleSheet {
  create: (atomRecord: AtomRecord) => void;
  __reset: () => void;
  getColorScheme: () => NonNullable<ColorSchemeName>;
  setColorScheme: (system?: ColorSchemeName | "system") => void;
  toggleColorScheme: () => void;
  setVariables: (properties: Record<`--${string}`, VariableValue>) => void;
  setDimensions: (dimensions: Dimensions) => void;
  useVariable: <T extends VariableValue>(
    name: `--${string}`
  ) => [T, (value: T) => void];
  __dangerouslyCompileStyles: (callback: (className: string) => void) => void;
}

export declare const NativeWindStyleSheet: NativeWindStyleSheet;
