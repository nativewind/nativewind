import { ComponentType } from "react";

export function maybeHijackSafeAreaProvider(type: ComponentType<any>) {
  return type;
}
