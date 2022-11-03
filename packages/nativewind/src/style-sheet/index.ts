import { ColorSchemeName, Dimensions } from "react-native";
import type { AtomRecord, VariableValue } from "../transform-css/types";

export * from "./web";

export declare function useUnsafeVariable<
  T extends string | number | undefined
>(name: `--${string}`): [T | undefined, (value: T) => void];

export interface NativeWindStyleSheet {
  create: (atomRecord: AtomRecord) => void;
  __reset: () => void;
  getColorScheme: () => NonNullable<ColorSchemeName>;
  setColorScheme: (system?: ColorSchemeName | "system") => void;
  toggleColorScheme: () => void;
  setVariables: (properties: Record<`--${string}`, VariableValue>) => void;
  setDimensions: (dimensions: Dimensions) => void;
  setWebClassNameMergeStrategy: (callback: (classes: string) => string) => void;
  __dangerouslyCompileStyles: (callback: (className: string) => void) => void;
}

export declare const NativeWindStyleSheet: NativeWindStyleSheet;
