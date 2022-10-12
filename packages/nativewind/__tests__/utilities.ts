import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { getCreateOptions } from "../src/transform-css";
import nativePreset from "../src/tailwind";
import { AtomRecord } from "../src/transform-css/types";

interface NativewindCompileOptions {
  css?: string;
  config?: Partial<Config>;
  name?: string;
}

export function compile(
  classNames: string,
  { css, config }: NativewindCompileOptions = {}
) {
  const output = postcss([
    tailwind({
      content: [],
      safelist: classNames.split(" "),
      presets: [nativePreset],
      ...config,
    }),
  ]).process(`@tailwind components;@tailwind utilities;${css ?? ""}`).css;

  // Put a console.log here to see the CSS output
  // console.log(output);

  return output;
}

export function c(classNames: string, options?: NativewindCompileOptions) {
  return getCreateOptions(compile(classNames, options));
}

interface TestCompile extends jest.It {
  (
    name: string,
    options: NativewindCompileOptions | ((record: AtomRecord) => void),
    fn?: (record: AtomRecord) => void,
    timeout?: number
  ): void;

  only: TestCompile;
  skip: TestCompile;
}

const createTestCompileProxy = <T extends jest.It>(object: T): T =>
  new Proxy(object, {
    apply(target, _, [classNames, options, fn]) {
      const compileOptions =
        typeof options === "function" ? undefined : options;
      fn = typeof options === "function" ? options : fn;
      if (fn) {
        target([classNames, options.name].filter(Boolean).join(" - "), () =>
          fn(c(classNames, compileOptions))
        );
      }
    },
    get(target, attribute) {
      return createTestCompileProxy(
        (target as unknown as Record<string | symbol, T>)[attribute]
      );
    },
  });

export const testCompile = createTestCompileProxy(test as TestCompile);
