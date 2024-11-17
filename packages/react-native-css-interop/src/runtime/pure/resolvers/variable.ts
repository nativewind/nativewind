import { StyleValueSubResolver } from ".";
import type { RuntimeFunction } from "../types";

export const resolveVariable: StyleValueSubResolver<RuntimeFunction> = (
  resolveValue,
  state,
  func,
  options,
) => {
  const args = func[2];
  if (!args || !args[0]) return;

  const name = resolveValue(state, args[0], options);

  if (typeof name !== "string") {
    return;
  }

  let value = options.getVariable(name);

  // If there is no value, check for a default value
  if (value === undefined && args[1]) {
    value = resolveValue(state, args[1], options);
  }

  return value;
};
