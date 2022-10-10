import plugin from "tailwindcss/plugin";

export default plugin(function ({ addUtilities, theme }) {
  addUtilities({
    ":root": Object.fromEntries(reduceVariables(theme("variables"))),
    ".dark": Object.fromEntries(reduceVariables(theme("darkVariables"))),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
});

type VariableRecord = { [key: string]: VariableRecord | string | number };

function reduceVariables(
  object?: VariableRecord,
  prefix = ""
): Array<[string, string | number]> {
  if (!object) return [];

  return Object.entries(object).flatMap(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      return prefix
        ? [[`--${prefix}-${key}`, value]]
        : [[`--${prefix}-${key}`, value]];
    }

    return reduceVariables(value, prefix ? `${prefix}-${key}` : key);
  });
}
