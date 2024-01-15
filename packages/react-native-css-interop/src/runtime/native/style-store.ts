import { StyleRuleSet } from "../../types";
import { Observable, observable } from "../observable";
import { warned, warnings } from "./globals";

export const globalStyles = new Map<string, Observable<StyleRuleSet>>();

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

    styleObservable.set(ruleSet);
  } else if (!deepEqual(styleObservable.get(), ruleSet)) {
    styleObservable.set(ruleSet);
  }
}

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2)
    // it's just the same object. No need to compare.
    return true;

  //check if value is primitive
  if (obj1 !== Object(obj1) && obj2 !== Object(obj2))
    // compare primitives
    return obj1 === obj2;

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // compare objects with same number of keys
  for (let key in obj1) {
    if (!(key in obj2)) return false; //other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
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
