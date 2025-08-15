import tailwind from "@tailwindcss/postcss";
import {
  screen,
  render as tlRender,
  type RenderOptions,
} from "@testing-library/react-native";
import postcss from "postcss";
import type { compile } from "react-native-css/compiler";
import { View } from "react-native-css/components";
import { registerCSS } from "react-native-css/jest";

export * from "./index";

const testID = "nativewind";

export type NativewindRenderOptions = RenderOptions & {
  /** Replace the generated CSS*/
  css?: string;
  /** Appended after the generated CSS */
  extraCss?: string;
  /** Add `@source inline('<className>')` to the CSS. @default Values are extracted from the component's className */
  sourceInline?: string[];
  /** Whether to include the theme in the generated CSS @default true */
  theme?: boolean;
  /** Whether to include the preflight in the generated CSS @default false */
  preflight?: boolean;
  /** Whether to include the plugin in the generated CSS. @default true */
  plugin?: boolean;
  /** Enable debug logging. @default false - Set process.env.NATIVEWIND_TEST_AUTO_DEBUG and run tests with the node inspector   */
  debug?: boolean;
};

const debugDefault = Boolean(
  process.env.NATIVEWIND_TEST_AUTO_DEBUG &&
    process.env.NODE_OPTIONS?.includes("--inspect"),
);

export async function render(
  component: React.ReactElement<any>,
  {
    css,
    sourceInline = Array.from(getClassNames(component)),
    debug = debugDefault,
    theme = true,
    preflight = false,
    plugin = true,
    extraCss,
    ...options
  }: NativewindRenderOptions = {},
): Promise<ReturnType<typeof tlRender> & ReturnType<typeof compile>> {
  if (!css) {
    css = ``;

    if (theme) {
      css += `@import "tailwindcss/theme.css" layer(theme);\n`;
    }

    if (preflight) {
      css += `@import "tailwindcss/preflight.css" layer(base);\n`;
    }

    css += `@import "tailwindcss/utilities.css" layer(utilities) source(none);\n`;

    if (plugin) {
      css += `@import "./theme.css";\n`;
    }
  }

  css += sourceInline
    .map((source) => `@source inline("${source}");`)
    .join("\n");

  if (extraCss) {
    css += `\n${extraCss}`;
  }

  if (debug) {
    console.log(`Input CSS:\n---\n${css}\n---\n`);
  }

  // Process the TailwindCSS
  let { css: output } = await postcss([
    /* Tailwind seems to internally cache things, so we need a random value to cache bust */
    tailwind({ base: Date.now().toString() }),
  ]).process(css, {
    from: __dirname,
  });

  if (debug) {
    console.log(`Output CSS:\n---\n${output}\n---\n`);
  }

  const compiled = registerCSS(output, { debug });

  return Object.assign(
    {},
    tlRender(component, {
      ...options,
    }),
    compiled,
  );
}

render.debug = (
  component: React.ReactElement<any>,
  options: RenderOptions = {},
) => {
  return render(component, { ...options, debug: true });
};

function getClassNames(
  component: React.ReactElement<any>,
  classNames: Set<string> = new Set(),
) {
  if (component.props?.className) {
    classNames.add(component.props.className);
  }

  if (component.props?.children) {
    const children: React.ReactElement<any>[] = Array.isArray(
      component.props.children,
    )
      ? component.props.children
      : [component.props.children];

    for (const child of children) {
      getClassNames(child, classNames);
    }
  }

  return classNames;
}

/**
 * Helper method that uses the current test name to render the component
 * Doesn't not support multiple components or changing the component type
 */
export async function renderCurrentTest({
  sourceInline = [expect.getState().currentTestName?.split(/\s+/).at(-1) ?? ""],
  ...options
}: NativewindRenderOptions = {}) {
  if (!sourceInline) {
    throw new Error(
      "unable to detect sourceInline, please manually set sourceInline in renderCurrentTest options",
    );
  }

  const { warnings: warningFn } = await render(
    <View testID={testID} className={sourceInline.join(" ")} />,
    options,
  );
  const component = screen.getByTestId(testID, { hidden: true });

  // Strip the testID and the children
  const { testID: _testID, children, ...props } = component.props;

  const compilerWarnings = warningFn();

  console.log({ compilerWarnings });

  let warnings: Record<string, unknown> | undefined;

  if (compilerWarnings.properties) {
    warnings ??= {};
    warnings.properties = compilerWarnings.properties;
  }

  const warningValues = compilerWarnings.values;

  if (warningValues) {
    warnings ??= {};
    warnings.values = Object.fromEntries(
      Object.entries(warningValues).map(([key, value]) => [
        key,
        value.length > 1 ? value : value[0],
      ]),
    );
  }

  return warnings ? { props, warnings } : { props };
}

renderCurrentTest.debug = (options: NativewindRenderOptions = {}) => {
  return renderCurrentTest({ ...options, debug: true });
};
