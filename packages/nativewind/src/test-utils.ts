import { RenderOptions, render } from "@testing-library/react-native";
import { format as prettyFormat } from "pretty-format";
import postcss from "postcss";
import { registerCSS } from "react-native-css-interop/testing-library";
import tailwind from "tailwindcss";
import { cssToReactNativeRuntimeOptions } from "./with-tailwind-options";

export async function renderTailwind<T>(
  component: React.ReactElement<T>,
  options?: RenderOptions,
): Promise<ReturnType<typeof render>> {
  const { css } = await postcss([
    tailwind({
      theme: {},
      content: [{ raw: prettyFormat(component), extension: "html" }],
    }),
  ]).process("@tailwind base;@tailwind components;@tailwind utilities;", {
    from: undefined,
  });

  registerCSS(css, cssToReactNativeRuntimeOptions);

  return render(component, options);
}
