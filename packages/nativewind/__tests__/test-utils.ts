import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { getCreateOptions } from "../src/transform-css";
import nativePreset from "../src/tailwind/native";
import { AtomRecord } from "../src/transform-css/types";
import { NativeWindStyleSheet } from "../src";
import postcssPluginPack from "../src/postcss/plugin";

interface NativewindCompileOptions {
  css?: string;
  config?: Partial<Config>;
  nameSuffix?: string;
  name?: string;
}

function compile(
  classNames: string,
  { css, config }: NativewindCompileOptions = {}
) {
  const output = postcss([
    tailwind({
      ...config,
      content: [],
      presets: [nativePreset],
      safelist: [
        ...classNames.split(" "),
        ...(config?.safelist ?? []),
      ] as string[],
    }),
    postcssPluginPack,
  ]).process(`@tailwind components;@tailwind utilities;${css ?? ""}`).css;

  // console.log(output);
  const compiled = getCreateOptions(output);
  // console.log(compiled);
  return compiled;
}

export function create(classNames: string, options?: NativewindCompileOptions) {
  NativeWindStyleSheet.create(compile(classNames, options));
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
        target(
          options.name ||
            `compile - ${[classNames, options.name]
              .filter(Boolean)
              .join(" - ")}`,
          () => fn(compile(classNames, compileOptions))
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
