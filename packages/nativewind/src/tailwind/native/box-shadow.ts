import { getStylesForProperty } from "css-to-react-native";

import { CustomPluginFunction } from "./types";

export const boxShadow: CustomPluginFunction = (
  { matchUtilities, theme, addComponents },
  notSupported
) => {
  matchUtilities(
    {
      "shadow-inner": notSupported("shadow-inner"),
    },
    { values: theme("boxShadow"), type: ["shadow"] }
  );

  const themeValues = Object.entries(theme("boxShadow"));
  const elevation = theme("elevation");

  const androidShadowComponents = themeValues.map(([size, value]) => ({
    "@media android": {
      [key(size)]: {
        elevation: elevation[size],
        shadowColor: getStylesForProperty("boxShadow", value as string)
          .shadowColor,
      },
    },
  }));

  const iosShadowComponents = themeValues.map(([size, value]) => ({
    "@media ios": {
      [key(size)]: {
        boxShadow: value,
      },
    },
  }));

  const webShadowComponents = themeValues.map(([size, value]) => ({
    "@media web": {
      [key(size)]: {
        boxShadow: value,
      },
    },
  }));

  addComponents([
    androidShadowComponents,
    iosShadowComponents,
    webShadowComponents,
  ]);
};

const key = (size: string) => {
  return size === "DEFAULT" ? ".shadow" : `.shadow-${size}`;
};
