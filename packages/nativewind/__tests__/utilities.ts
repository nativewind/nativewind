import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { getCreateOptions } from "../src/transform-css";

export function extractStyles(
  tailwindConfig: Config,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  const css = postcss([tailwind(tailwindConfig)]).process(cssInput).css;
  return getCreateOptions(css);
}
