import { Platform, ViewStyle, ImageStyle, TextStyle, View } from "react-native";
import { RenderOptions, render, screen } from "@testing-library/react-native";
import tailwindcssContainerQueries from "@tailwindcss/container-queries";
import postcss from "postcss";
import {
  ExtractionWarning,
  createMockComponent,
  registerCSS,
  warnings,
} from "react-native-css-interop/testing-library";
import tailwind, { Config } from "tailwindcss";
import { cssToReactNativeRuntimeOptions } from "./metro/common";

export { createMockComponent } from "react-native-css-interop/testing-library";

export interface RenderTailwindOptions extends RenderOptions {
  config?: Omit<Config, "content">;
  base?: boolean;
  css?: string;
  testID?: string;
  animated?: boolean;
}

process.env.NATIVEWIND_NATIVE = Platform.OS;

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
      presets: [require("./tailwind")],
      plugins: [tailwindcssContainerQueries],
      content: getClassNames(component),
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
    props?: Record<string, unknown>;
    warning?: (name: string) => Map<string, ExtractionWarning[]>;
  },
];

function getClassNames(
  component: React.ReactElement<any>,
): Array<{ raw: string; extension?: string }> {
  const classNames: Array<{ raw: string; extension?: string }> = [];

  if (component.props.className) {
    classNames.push({ raw: component.props.className });
  }

  if (component.props.children) {
    const children: React.ReactElement<any>[] = Array.isArray(
      component.props.children,
    )
      ? component.props.children
      : [component.props.children];

    classNames.push(...children.flatMap((c) => getClassNames(c)));
  }

  return classNames;
}

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

    const component = screen.getByTestId(testID, {
      includeHiddenElements: true,
    });

    if (animated) {
      expect(component).toHaveAnimatedStyle(expected.style as any);
    } else if (expected.style) {
      expect(component).toHaveStyle(
        Object.fromEntries(Object.entries(expected.style)),
      );
    }

    if (expected.props) {
      expect(component.props).toEqual(expect.objectContaining(expected.props));
    }

    if (expected.warning) {
      expect(warnings).toEqual(expected.warning(className));
    } else {
      expect(warnings).toEqual(new Map());
    }
  });
}
