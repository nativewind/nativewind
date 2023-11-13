import plugin from "tailwindcss/plugin";
import transformThemeValue from "tailwindcss/lib/util/transformThemeValue";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";
import { parseBoxShadowValue } from "tailwindcss/lib/util/parseBoxShadowValue";

export const shadows = plugin(({ matchUtilities, theme, ...rest }) => {
  const { addDefaults } = rest as any;
  const values = theme("dropShadow");
  const entries = values ? Object.entries(values) : [];

  function getElevation(value: any) {
    let elevationKey: any = entries.find((entry) => entry[1] === value)?.[0];

    let elevation: number;

    if (elevationKey) {
      elevation = theme("elevation")?.[elevationKey];
    } else {
      elevation = Number.parseFloat(value.split(" ")[2]);
    }

    if (elevation === undefined || Number.isNaN(elevation)) {
      elevation = 0;
    }

    return elevation;
  }

  let transformValue = transformThemeValue("boxShadow");

  addDefaults(" box-shadow", {
    "--tw-ring-offset-shadow": "0 0 #0000",
    "--tw-ring-shadow": "0 0 #0000",
    "--tw-shadow": "0 0 #0000",
    "--tw-shadow-colored": "0 0 #0000",
  });

  matchUtilities(
    {
      elevation: (value) => {
        return {
          "-rn-elevation": value,
        } as any;
      },
    },
    { values: theme("elevation") },
  );

  matchUtilities(
    {
      shadow: (value) => {
        const elevation = getElevation(value);

        value = transformValue(value);

        let ast = parseBoxShadowValue(value);

        const firstValid = ast.find((shadow: any) => shadow.valid);

        if (!firstValid) {
          return;
        }

        const { x, y, blur, color } = firstValid;

        return {
          "--tw-shadow-color": value === "none" ? "#0000" : color,
          "-rn-shadowColor": "var(--tw-shadow-color)",
          "-rn-shadow-offset": `${x} ${y}`,
          "-rn-shadow-radius": blur ?? 0,
          "-rn-shadow-opacity": 1,
          "-rn-elevation": elevation,
        } as any;
      },
    },
    { values: theme("boxShadow"), type: ["shadow"] },
  );

  matchUtilities(
    {
      shadow: (value) => {
        return {
          "--tw-shadow-color": toColorValue(value),
        };
      },
    },
    {
      values: flattenColorPalette(theme("boxShadowColor")),
      type: ["color", "any"],
    },
  );
});
