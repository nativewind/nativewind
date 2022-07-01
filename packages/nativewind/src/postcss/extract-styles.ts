import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import plugin from "../postcss";

import { StyleError } from "../types/common";
import { ExtractedValues } from "./plugin";
import { serializer } from "./serialize";

export function extractStyles(
  tailwindConfig: Config,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  let errors: StyleError[] = [];

  let output: ExtractedValues = {
    styles: {},
    topics: {},
    masks: {},
    atRules: {},
    units: {},
    childClasses: {},
  };

  const plugins = [
    tailwind(tailwindConfig as Config),
    plugin({
      ...tailwindConfig,
      done: ({ errors: resultErrors, ...result }) => {
        output = result;
        errors = resultErrors;
      },
    }),
  ];

  postcss(plugins).process(cssInput).css;

  return {
    ...serializer(output),
    errors,
  };
}
