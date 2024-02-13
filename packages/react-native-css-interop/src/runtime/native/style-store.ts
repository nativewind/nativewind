import { StyleRuleSet } from "../../types";
import { Observable, observable } from "../observable";
import { warned, warnings } from "./globals";

export const globalStyles = new Map<string, Observable<StyleRuleSet>>();
export const opaqueStyles = new WeakMap<object, StyleRuleSet>();

export function upsertGlobalStyle(name: string, ruleSet: StyleRuleSet) {
  let styleObservable = globalStyles.get(name);

  if (!styleObservable) {
    styleObservable = observable(ruleSet, { name });
    globalStyles.set(name, styleObservable);
    if (process.env.NODE_ENV !== "production") {
      const originalGet = styleObservable.get;
      styleObservable.get = () => {
        const value = originalGet();
        printWarnings(name, value);
        return value;
      };
    }
  }

  styleObservable.set(ruleSet);
}

function printWarnings(name: string, ruleSet: StyleRuleSet | object) {
  if (!("$$type" in ruleSet) || !ruleSet.warnings) return;
  if (process.env.NODE_ENV === "test") {
    warnings.set(name, ruleSet.warnings);
  } else {
    warned.add(name);
    // for (const warning of ruleSet.warnings) {
    // switch (warning.type) {
    //   case "IncompatibleNativeProperty":
    //     console.log("IncompatibleNativeProperty ", warning.property);
    //     break;
    //   case "IncompatibleNativeValue":
    //     console.log(
    //       "IncompatibleNativeValue ",
    //       warning.property,
    //       warning.value,
    //     );
    //     break;
    //   case "IncompatibleNativeFunctionValue":
    //     console.log(
    //       "IncompatibleNativeFunctionValue ",
    //       warning.property,
    //       warning.value,
    //     );
    //     break;
    // }
    // }
  }
}
