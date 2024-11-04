import type { RuntimeFunction, StyleValueSubResolver } from "../types";
import { resolveVariable } from "./variable";

export const resolveRuntimeFunction: StyleValueSubResolver<RuntimeFunction> = (
  resolveValue,
  state,
  func,
  options,
) => {
  const name = func[1];
  switch (name) {
    case "var": {
      return resolveVariable(resolveValue, state, func, options);
    }
    // case "vh": {
    //   // 50vh = 50% of the viewport height
    //   const value = resolveValue(state, func[2]?.[0], options);
    //   const vhValue = vh.get(options.effect) / 100;
    //   return typeof value === "number" ? round(vhValue * value) : undefined;
    // }
    default: {
      const args = resolveValue(state, func[2], options);

      if (args === undefined) {
        return;
      } else if (Array.isArray(args)) {
        return `${name}(${args.join(",")})`;
      } else {
        return `${name}(${args})`;
      }
    }
  }
};
