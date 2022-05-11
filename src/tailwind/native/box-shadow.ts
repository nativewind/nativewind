import { CustomPluginFunction } from "./types";

export const boxShadow: CustomPluginFunction = (
  { matchUtilities, theme },
  notSupported
) => {
  const themeValues = Object.entries(theme("boxShadow"));
  const elevation = theme("elevation");

  matchUtilities(
    {
      shadow(value: string) {
        const size = themeValues.find(([, themeValue]) => value === themeValue);

        return size
          ? {
              boxShadow: value,
              elevation: elevation[size[0]],
            }
          : {
              boxShadow: value,
            };
      },
      "shadow-inner": notSupported("shadow-inner"),
    },
    { values: theme("boxShadow"), type: ["shadow"] }
  );
};
