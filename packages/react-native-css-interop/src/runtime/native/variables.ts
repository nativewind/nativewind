import { useContext } from "react";
import { RuntimeValueDescriptor, StyleProp } from "../../types";
import { useComputed } from "../signals";
import { effectContext } from "./inheritance";
import { opaqueStyles } from "./style";

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: StyleProp = {};
  opaqueStyles.set(style, {
    $$type: "runtime",
    variables: Object.entries(variables).map(([name, value]) => {
      return [name.startsWith("--") ? name : `--${name}`, value];
    }),
    specificity: {
      A: 0,
      B: 0,
      C: 0,
      I: 0,
      O: 0,
      S: 0,
      inline: 1,
    },
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const interop = useContext(effectContext);
  return useComputed(() => interop.signals.get(name)?.get(), interop);
};
