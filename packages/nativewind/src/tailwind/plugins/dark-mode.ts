import plugin from "tailwindcss/plugin";

export const darkMode = plugin(function ({ config, addUtilities }) {
  const configValue = config("darkMode");

  if (
    (typeof configValue === "string" && configValue === "class") ||
    Array.isArray(configValue)
  ) {
    addUtilities({
      ":root": {
        "--dark-mode": "class",
      },
    });
  }
});
