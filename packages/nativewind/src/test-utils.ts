import { RenderOptions, render } from "@testing-library/react-native";
import { format as prettyFormat } from "pretty-format";
import postcss from "postcss";
import { registerCSS } from "react-native-css-interop/testing-library";
import tailwind from "tailwindcss";

export function renderTailwind<T>(
  component: React.ReactElement<T>,
  options?: RenderOptions,
): ReturnType<typeof render> {
  const css = postcss([
    tailwind({
      theme: {},
      content: [{ raw: prettyFormat(component), extension: "html" }],
    }),
  ]).process("@tailwind base;@tailwind components;@tailwind utilities;").css;

  registerCSS(css);

  return render(component, options);
}
