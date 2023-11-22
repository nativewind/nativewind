import { ComponentType } from "react";
import type { EnableCssInteropOptions, InteropFunction } from "../../types";

export function unstable_styled<P extends object, M>(
  component: ComponentType<P>,
  mapping?: EnableCssInteropOptions<P> & M,
  interop?: InteropFunction,
) {
  throw new Error("Not implemented");
}
