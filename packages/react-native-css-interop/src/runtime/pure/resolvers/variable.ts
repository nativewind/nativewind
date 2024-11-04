import type { RuntimeFunction, StyleValueSubResolver } from "../types";

export const resolveVariable: StyleValueSubResolver<RuntimeFunction> = (
  resolveValue,
  state,
  func,
  options,
) => {
  const args = func[2];
  if (!args || !args[0]) return;

  let name = resolveValue(state, args[0], options);

  let value: unknown;

  if (typeof name === "string") {
    value = resolveValue(state, state.variables?.[name], options);
    value ??= resolveValue(state, options.getVariable(name), options);
  }

  if (value === undefined && args[1]) {
    value = resolveValue(state, args[1], options);
  }

  return value;
};
