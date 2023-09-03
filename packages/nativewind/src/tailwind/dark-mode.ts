import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const isNative = Boolean(process.env.NATIVEWIND_NATIVE);

export const darkModeAtRule = plugin(function ({ config, addBase }) {
  const darkMode = config<Config["darkMode"]>("darkMode");

  let type: string | undefined = "media";
  let value: string | undefined;

  if (darkMode === "media" || !darkMode) {
    type = "media";
  } else if (darkMode === "class") {
    type = "class";
    value = "dark";
  } else if (darkMode[0] === "class") {
    type = "class";
    value = darkMode[1];

    if (!value) {
      return;
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      type = "attribute";
      value = value.slice(1, -1);
    } else if (value.startsWith(".")) {
      value = value.slice(1);
    }
  }

  if (isNative) {
    const atRule = ["@cssInterop set darkMode", type, value]
      .filter(Boolean)
      .join(" ");

    addBase({ [atRule]: "" });
  } else {
    addBase({
      ":root": {
        "--css-interop-darkMode": [type, value].filter(Boolean).join(" "),
      },
    });
  }
});
