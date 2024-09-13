import {
  useContext,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import Platform from "react-native/Libraries/Utilities/Platform";
import { VariableContext, VariableContextValue } from "../native/styles";

type SafeAreaLibraryTypes = typeof import("react-native-safe-area-context");
type SafeAreaProviderProps = ComponentProps<
  SafeAreaLibraryTypes["SafeAreaProvider"]
>;

let SafeAreaLibrary: SafeAreaLibraryTypes | void = undefined;

try {
  SafeAreaLibrary = require("react-native-safe-area-context");
} catch {}

export function maybeHijackSafeAreaProvider<T>(type: T) {
  // The types for Platform are incorrect when directly imported
  return (Platform as any).OS !== "web" &&
    SafeAreaLibrary?.SafeAreaProvider === type
    ? SafeAreaProviderShim
    : type;
}

export function SafeAreaProviderShim({
  children,
  ...props
}: SafeAreaProviderProps) {
  if (!SafeAreaLibrary) return <>{children}</>;

  const SafeAreaProvider = SafeAreaLibrary.SafeAreaProvider;

  return (
    <SafeAreaProvider {...props}>
      <SafeAreaEnv>{children}</SafeAreaEnv>
    </SafeAreaProvider>
  );
}

function SafeAreaEnv({ children }: PropsWithChildren<{}>) {
  if (!SafeAreaLibrary) {
    return <>{children}</>;
  }

  const parentVars = useContext(VariableContext);
  const insets = SafeAreaLibrary.useSafeAreaInsets();

  const value = useMemo<VariableContextValue>(
    () => ({
      ...parentVars,
      "--___css-interop___safe-area-inset-bottom": insets.bottom,
      "--___css-interop___safe-area-inset-left": insets.left,
      "--___css-interop___safe-area-inset-right": insets.right,
      "--___css-interop___safe-area-inset-top": insets.top,
    }),
    [parentVars, insets],
  );

  return (
    <VariableContext.Provider value={value}>
      {children}
    </VariableContext.Provider>
  );
}

export const ReactNativeSafeAreaContext = SafeAreaLibrary;
