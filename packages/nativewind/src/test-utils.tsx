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

const A = createMockComponent();

export function testCases(cases: Case[]) {
  test.each(cases)("%s", async (className, expected) => {
    await renderTailwind(<A className={className} />);

    if (expected.style) {
      expect(A).styleToEqual(expected.style);
    } else {
      expect(A).styleToEqual({});
    }

    if (expected.warning) {
      expect(A).toHaveStyleWarnings(expected.warning(className));
    } else {
      expect(A).toHaveStyleWarnings(new Map());
    }

    if (expected.meta) {
      expect(A).styleMetaToEqual(expected.meta);
    } else {
      expect(A).styleMetaToEqual(undefined);
    }
  });
}
