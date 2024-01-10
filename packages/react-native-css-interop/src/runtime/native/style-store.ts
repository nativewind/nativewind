import {
  GroupedRuntimeStyle,
  GroupedTransportStyles,
  PropRuntimeValueDescriptor,
  RuntimeStyle,
  TransportStyle,
} from "../../types";
import { createSignal } from "../signals";
import { styleSignals, warned, warnings } from "./globals";
import { parseValue } from "./resolve-value";

export function upsertStyleSignal(
  name: string,
  groupedStyleMeta: GroupedTransportStyles,
) {
  const meta: GroupedRuntimeStyle = {
    scope: groupedStyleMeta.scope,
    [0]: groupedStyleMeta[0]?.map(mapStyle),
    [1]: groupedStyleMeta[1]?.map(mapStyle),
    [2]: groupedStyleMeta[2]?.map(mapStyle),
  };

  let signal = styleSignals.get(name);
  if (signal) {
    if (!deepEqual(signal.peek(), meta)) {
      signal.set(meta);
      if (process.env.NODE_ENV !== "production") {
        warned.delete(name);
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }
    }
  } else {
    let signal = styleSignals.get(name);

    if (signal) {
      signal.set(meta);
    } else {
      signal = createSignal(meta, name);
      if (process.env.NODE_ENV !== "production") {
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }

      styleSignals.set(name, signal);
    }
  }
}

function mapStyle(style: TransportStyle): RuntimeStyle {
  return {
    ...style,
    $$type: "runtime",
    props: style.props?.map(([key, value]) => {
      if (isPropDescriptor(value)) {
        return [key, parseValue(value.value)];
      } else {
        return [
          key,
          Object.fromEntries(value.map(([k, v]) => [k, parseValue(v)])),
        ];
      }
    }),
  };
}

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2)
    // it's just the same object. No need to compare.
    return true;

  if (isPrimitive(obj1) && isPrimitive(obj2))
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

//check if value is primitive
function isPrimitive(obj: any) {
  return obj !== Object(obj);
}

export function isPropDescriptor(
  value: unknown,
): value is PropRuntimeValueDescriptor {
  return typeof value === "object" && value !== null && "$$type" in value;
}

function printWarnings(name: string, groupedStyleMeta: GroupedTransportStyles) {
  if (!groupedStyleMeta.warnings) return;

  for (const warning of groupedStyleMeta.warnings) {
    if (process.env.NODE_ENV === "test") {
      warnings.set(name, groupedStyleMeta.warnings);
    } else {
      warned.add(name);

      switch (warning.type) {
        case "IncompatibleNativeProperty":
          console.log("IncompatibleNativeProperty ", warning.property);
          break;
        case "IncompatibleNativeValue":
          console.log(
            "IncompatibleNativeValue ",
            warning.property,
            warning.value,
          );
          break;
        case "IncompatibleNativeFunctionValue":
          console.log(
            "IncompatibleNativeFunctionValue ",
            warning.property,
            warning.value,
          );
          break;
      }
    }
  }
}
