import plugin from "tailwindcss/plugin";

export default plugin(function ({ addUtilities, theme }) {
  const rootVariables = theme("variables");
  const darkVariables = theme("darkVariables");

  if (rootVariables && Object.keys(rootVariables).length > 0) {
    addUtilities({
      ":root": theme("variables"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  if (darkVariables && Object.keys(darkVariables).length > 0) {
    addUtilities({
      ":root[dark]": theme("darkVariables"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }
});
