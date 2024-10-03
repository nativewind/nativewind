import {
  ComponentType,
  createElement,
  useContext,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";
import { VariableContext, VariableContextValue } from "../native/styles";

type SafeAreaLibraryTypes = typeof import("react-native-safe-area-context");
type SafeAreaProviderProps = ComponentProps<
  SafeAreaLibraryTypes["SafeAreaProvider"]
>;

let safeAreaProviderShim: ComponentType | undefined;

export function maybeHijackSafeAreaProvider(type: ComponentType<any>) {
  const name = type.displayName || type.name;
  if (Platform.OS !== "web" && name === "SafeAreaProvider") {
    safeAreaProviderShim ||= shimFactory(type);
    type = safeAreaProviderShim;
  }

  return type;
}

function shimFactory(type: ComponentType<any>) {
  function SafeAreaEnv({ children }: PropsWithChildren<{}>) {
    const parentVars = useContext(VariableContext);
    const insets =
      require("react-native-safe-area-context").useSafeAreaInsets();

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

    return createElement(VariableContext.Provider, { value }, children);
  }

  return function SafeAreaProviderShim({
    children,
    ...props
  }: SafeAreaProviderProps) {
    return createElement(type, props, createElement(SafeAreaEnv, {}, children));
  };
}
