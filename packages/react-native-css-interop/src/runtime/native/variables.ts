import { StyleProp } from "../../types";
import { useComputed } from "../signals";
import { useContext } from "react";
import { effectContext } from "./inheritance";
import { InlineSpecificity, opaqueStyles } from "./style";
import { specificityCompare } from "../specificity";

export function vars(variables: Record<string, string | number>) {
  const style: StyleProp = {};
  opaqueStyles.set(style, {
    reducer(acc) {
      for (let [key, value] of Object.entries(variables)) {
        if (!key.startsWith("--")) {
          key = `--${key}`;
        }

        const specificity = acc.variablesSpecificity[key];

        if (
          specificity &&
          specificityCompare(specificity, InlineSpecificity) >= 0
        ) {
          continue;
        }

        acc.setVariable(key, value, InlineSpecificity);
      }

      return acc;
    },
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const interop = useContext(effectContext);
  return useComputed(() => interop.signals.get(name)?.get(), interop);
};
