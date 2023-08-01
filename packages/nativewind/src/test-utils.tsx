import { Platform, ViewStyle, ImageStyle, TextStyle, View } from "react-native";
import { RenderOptions, render, screen } from "@testing-library/react-native";
import postcss from "postcss";
import {
  ExtractionWarning,
  createMockComponent,
  registerCSS,
  warnings,
} from "react-native-css-interop/testing-library";
import tailwind, { Config } from "tailwindcss";
import { cssToReactNativeRuntimeOptions } from "./metro/with-tailwind-options";

export { createMockComponent } from "react-native-css-interop/testing-library";

import nativewindPlugin from "./tailwind";

export interface RenderTailwindOptions extends RenderOptions {
  config?: Omit<Config, "content">;
  base?: boolean;
  css?: string;
  testID?: string;
  animated?: boolean;
}

process.env.NATIVEWIND_NATIVE = Platform.OS !== "web" ? "1" : undefined;

export async function renderTailwind<T extends { className: string }>(
  component: React.ReactElement<T>,
  {
    base = false,
    // Skip base my default to speed up the tests (as base rarely impacts the tested classes)
    css = base
      ? "@tailwind base;@tailwind components;@tailwind utilities;"
      : "@tailwind components;@tailwind utilities;",
    config = {},
    ...options
  }: RenderTailwindOptions = {},
): Promise<ReturnType<typeof render>> {
  let { css: output } = await postcss([
    tailwind({
      theme: {},
      ...config,
      presets: config.presets ? config.presets : [nativewindPlugin],
      content: [{ raw: component.props.className }],
    }),
  ]).process(css, { from: undefined });

  // console.log(output);

  registerCSS(output, cssToReactNativeRuntimeOptions);

  return render(component, options);
}

type Style = ViewStyle & TextStyle & ImageStyle;
type TestCase = [
  string,
  {
    style?: ReturnType<typeof style>["style"];
    warning?: (name: string) => Map<string, ExtractionWarning[]>;
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

export function testCases(...cases: TestCase[]) {
  return testCasesWithOptions({}, ...cases);
}

export function testCasesWithOptions(
  {
    testID = "react-native-css-interop",
    animated = false,
    ...options
  }: RenderTailwindOptions,
  ...cases: TestCase[]
) {
  const A = createMockComponent(View);

  test.each(cases)("%s", async (className, expected) => {
    await renderTailwind(<A testID={testID} className={className} />, options);

    const component = screen.getByTestId(testID);

    if (animated) {
      expect(component).toHaveAnimatedStyle(expected.style ?? {});
    } else {
      expect(component).toHaveStyle(expected.style ?? {});
    }

    if (expected.warning) {
      expect(warnings).toEqual(expected.warning(className));
    } else {
      expect(warnings).toEqual(new Map());
    }
  });
}
