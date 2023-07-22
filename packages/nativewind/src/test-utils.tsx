import { ViewStyle, ImageStyle, TextStyle } from "react-native";
import { RenderOptions, render } from "@testing-library/react-native";
import { format as prettyFormat } from "pretty-format";
import postcss from "postcss";
import {
  createMockComponent,
  registerCSS,
} from "react-native-css-interop/testing-library";
import tailwind from "tailwindcss";
import { cssToReactNativeRuntimeOptions } from "./metro/with-tailwind-options";
import {
  ExtractionWarning,
  StyleMeta,
} from "react-native-css-interop/dist/types";
import exp from "constants";

export interface RenderTailwindOptions extends RenderOptions {
  trimBase?: boolean;
}

export async function renderTailwind<T>(
  component: React.ReactElement<T>,
  { trimBase = true, ...options }: RenderTailwindOptions = {},
): Promise<ReturnType<typeof render>> {
  let { css } = await postcss([
    tailwind({
      theme: {},
      content: [{ raw: prettyFormat(component), extension: "html" }],
    }),
  ]).process(
    "@tailwind base;/*END_OF_BASE*/@tailwind components;@tailwind utilities;",
    {
      from: undefined,
    },
  );

  if (trimBase) {
    const index = css.indexOf("/*END_OF_BASE*/");
    css = css.substring(index);
  }

  registerCSS(css, cssToReactNativeRuntimeOptions);

  return render(component, options);
}

type Style = ViewStyle & TextStyle & ImageStyle;
type Case = [
  string,
  {
    style?: ReturnType<typeof style>["style"];
    warning?: (name: string) => Map<string, ExtractionWarning[]>;
    meta?: StyleMeta;
  },
];

export const style = (style: Style & Record<string, unknown>) => ({ style });
export const invalidProperty = (...properties: string[]) => ({
  warning: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [
        name,
        properties.map((property) => ({
          type: "IncompatibleNativeProperty",
          property,
        })),
      ],
    ]),
});
export const invalidValue = (property: string, value: any) => ({
  warning: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [name, [{ type: "IncompatibleNativeValue", property, value }]],
    ]),
});

export function testCases(...cases: Case[]) {
  const A = createMockComponent();

  test.each(cases)("%s", async (className, expected) => {
    await renderTailwind(<A className={className} />);

    if (expected.style) {
      expect(A).styleToEqual(expected.style);
    } else {
      expect(A).styleToEqual(undefined);
    }

    if (expected.warning) {
      expect(A).toHaveStyleWarnings(expected.warning(className));
    } else {
      expect(A).toHaveStyleWarnings(new Map());
    }

    expect(className).styleMetaToEqual(expected.meta);
  });
}
