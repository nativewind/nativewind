import type { PropsWithChildren, ReactElement } from "react";

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

const testID = "tailwind";

export type NativewindRenderOptions = RenderOptions & {
  /** Replace the generated CSS*/
  css?: string;
  /** Appended after the generated CSS */
  extraCss?: string;
  /** Specify the className to use for the component @default sourceInline */
  className?: string;
  /** Add `@source inline('<className>')` to the CSS. @default Values are extracted from the component's className */
  sourceInline?: string[];
  /** Whether to include the theme in the generated CSS @default true */
  theme?: boolean;
  /** Whether to include the preflight in the generated CSS @default false */
  preflight?: boolean;
  /** Whether to include the plugin in the generated CSS. @default true */
  plugin?: boolean;
  /** Enable debug logging. @default false - Set process.env.NATIVEWIND_TEST_AUTO_DEBUG and run tests with the node inspector   */
  debug?: boolean | "verbose";
};

const debugDefault = Boolean(process.env.NODE_OPTIONS?.includes("--inspect"));

export async function render(
  component: ReactElement<PropsWithChildren>,
  {
    css,
    sourceInline = Array.from(getClassNames(component)),
    debug = debugDefault,
    theme = true,
    preflight = false,
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

    css += `@import "tailwindcss/utilities.css" layer(utilities) source(none);\n@import "tailwindcss-safe-area";`;
  }

  css += sourceInline
    .map((source) => `@source inline("${source}");`)
    .join("\n");

  if (extraCss) {
    css += `\n${extraCss}`;
  }

  if (debug === "verbose") {
    console.log(`Input CSS:\n---\n${css}\n---\n`);
  }

  // Process the TailwindCSS
  const { css: output } = await postcss([
    /* Tailwind seems to internally cache things, so we need a random value to cache bust */
    tailwind({ base: Date.now().toString() }),
  ]).process(css, {
    from: __dirname,
  });

  if (debug) {
    console.log(`Output CSS:\n---\n${output}\n---\n`);
  }

  const compiled = registerCSS(output, { debug: Boolean(debug) });

  return Object.assign(
    {},
    tlRender(component, {
      ...options,
    }),
    compiled,
  );
}

render.debug = (
  component: ReactElement<PropsWithChildren>,
  options: RenderOptions = {},
) => {
  return render(component, { ...options, debug: true });
};

function getClassNames(
  component: ReactElement<PropsWithChildren>,
  classNames = new Set<string>(),
) {
  if (
    typeof component.props === "object" &&
    "className" in component.props &&
    typeof component.props.className === "string"
  ) {
    classNames.add(component.props.className);
  }

  if (component.props.children) {
    const rawChildren = Array.isArray(component.props.children)
      ? component.props.children
      : [component.props.children];

    const children = rawChildren.filter(
      (child): child is ReactElement<PropsWithChildren> => {
        return !!child && typeof child === "object" && "props" in child;
      },
    );

    for (const child of children) {
      getClassNames(child, classNames);
    }
  }

  return classNames;
}

export async function renderSimple({
  className,
  ...options
}: NativewindRenderOptions & { className: string }) {
  const { warnings: warningFn } = await render(
    <View testID={testID} className={className} />,
    options,
  );
  const component = screen.getByTestId(testID, {
    hidden: true,
  }) as { props: Record<string, unknown> } & typeof View;

  // Strip the testID and the children
  const { testID: _testID, children, ...props } = component.props;

  const compilerWarnings = warningFn();

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

renderSimple.debug = (
  options: NativewindRenderOptions & { className: string },
) => {
  return renderSimple({ ...options, debug: true });
};

/**
 * Helper method that uses the current test name to render the component
 * Doesn't not support multiple components or changing the component type
 */
export async function renderCurrentTest({
  sourceInline = [expect.getState().currentTestName?.split(/\s+/).at(-1) ?? ""],
  className = sourceInline.join(" "),
  ...options
}: NativewindRenderOptions = {}) {
  return renderSimple({
    ...options,
    sourceInline,
    className,
  });
}

renderCurrentTest.debug = (options: NativewindRenderOptions = {}) => {
  return renderCurrentTest({ ...options, debug: true });
};
