import { createContext } from "react";
import { StyleSheetRuntime } from "./runtime";

export type { StylesArray, Snapshot } from "./runtime";
export { StyleSheetRuntime } from "./runtime";

const runtime = new StyleSheetRuntime();

export const NativeWindStyleSheet = {
  create: runtime.create.bind(runtime),
  setDimensions: runtime.setDimensions.bind(runtime),
  setAppearance: runtime.setAppearance.bind(runtime),
  setPlatform: runtime.setPlatform.bind(runtime),
  setOutput: runtime.setOutput.bind(runtime),
  setColorScheme: runtime.setColorScheme.bind(runtime),
  parse: runtime.parse.bind(runtime),
  setDangerouslyCompileStyles:
    runtime.setDangerouslyCompileStyles.bind(runtime),
};

// We add this to a context so its overridable in tests
export const StoreContext = createContext(runtime);
