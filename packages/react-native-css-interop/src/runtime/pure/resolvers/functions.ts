import type { StyleValueSubResolver } from ".";
import type { RuntimeFunction } from "../types";
import { animationShorthand } from "./animation";
import { resolveVariable } from "./variable";

export const resolveRuntimeFunction: StyleValueSubResolver<RuntimeFunction> = (
  resolveValue,
  func,
  options,
) => {
  const name = func[1];
  switch (name) {
    case "@animation": {
      return animationShorthand(resolveValue, func, options);
    }
    case "var": {
      return resolveVariable(resolveValue, func, options);
    }
    // case "vh": {
    //   // 50vh = 50% of the viewport height
    //   const value = resolveValue(state, func[2]?.[0], options);
    //   const vhValue = vh.get(options.effect) / 100;
    //   return typeof value === "number" ? round(vhValue * value) : undefined;
    // }
    default: {
      const args = resolveValue(func[2], options);

      if (args === undefined) {
        return;
      } else if (Array.isArray(args)) {
        return `${name}(${args.join(", ")})`;
      } else {
        return `${name}(${args})`;
      }
    }
  }
};
