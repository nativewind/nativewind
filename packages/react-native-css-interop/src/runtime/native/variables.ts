import { useContext } from "react";
import { StyleProp } from "../../types";
import { useComputed } from "../signals";
import { effectContext } from "./inheritance";
import { opaqueStyles, reduceOpaqueStyle } from "./style";

export function vars(variables: Record<string, string | number>) {
  const style: StyleProp = {};
  opaqueStyles.set(style, {
    reducer(acc) {
      return reduceOpaqueStyle(acc, variables);
    },
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const interop = useContext(effectContext);
  return useComputed(() => interop.signals.get(name)?.get(), interop);
};
