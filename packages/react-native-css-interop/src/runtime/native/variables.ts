import { useContext } from "react";
import { RuntimeValueDescriptor, StyleProp } from "../../types";
import { useComputed } from "../signals";
import { opaqueStyles } from "./style";
import { STYLE_SCOPES } from "../../shared";
import { interopContext } from "./misc";

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: StyleProp = {};
  opaqueStyles.set(style, {
    $$type: "runtime",
    variables: Object.entries(variables).map(([name, value]) => {
      return [name.startsWith("--") ? name : `--${name}`, value];
    }),
    scope: STYLE_SCOPES.SELF,
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
  const state = useContext(interopContext);
  return useComputed(() => state.getVariable(name), state);
};
