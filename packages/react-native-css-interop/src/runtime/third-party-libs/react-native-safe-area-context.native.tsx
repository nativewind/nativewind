import {
  ComponentType,
  createElement,
  Fragment,
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
    try {
      /**
       * We can only require `react-native-safe-area-context` inside a component
       * If we require it at the top level, it will cause a circular dependency
       * as its in the `jsx` declaration, and since ``react-native-safe-area-context`
       * creates components that are used in the `jsx` declaration, it will
       * infinitely loop.
       */
      const {
        useSafeAreaInsets,
        SafeAreaProvider,
      } = require("react-native-safe-area-context");

      /**
       * Before this stage, we didn't know that type is the SafeAreaProvider,
       * we just know its a component with the same name.
       *
       * The function is replacing the children of the SafeAreaProvider.
       * We're not replacing the SafeAreaProvider itself.
       *
       * So, if this isn't the SafeAreaProvider, we can just render a Fragment1
       * Otherwise, we render the VariableContext.Provider
       */
      if (type !== SafeAreaProvider) {
        return createElement(Fragment, {}, children);
      }

      const insets = useSafeAreaInsets();
      const parentVarContext = useContext(VariableContext);

      const parentVars =
        parentVarContext instanceof Map
          ? Object.fromEntries(parentVarContext.entries())
          : parentVarContext;

      const value = useMemo<VariableContextValue>(
        () => ({
          ...parentVars,
          "--___css-interop___safe-area-inset-bottom": insets.bottom,
          "--___css-interop___safe-area-inset-left": insets.left,
          "--___css-interop___safe-area-inset-right": insets.right,
          "--___css-interop___safe-area-inset-top": insets.top,
        }),
        [parentVarContext, insets],
      );

      return createElement(VariableContext.Provider, { value }, children);
    } catch {
      return createElement(Fragment, {}, children);
    }
  }

  return function SafeAreaProviderShim({
    children,
    ...props
  }: SafeAreaProviderProps) {
    return createElement(type, props, createElement(SafeAreaEnv, {}, children));
  };
}
