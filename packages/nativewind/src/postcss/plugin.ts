import { writeFileSync } from "node:fs";
import { PluginCreator, Plugin } from "postcss";

import { getCreateOptions } from "./extract";

export interface NativeWindPostCssPlugin {
  output?: string;
}

function plugin({
  output = "./nativewind-output.js",
}: NativeWindPostCssPlugin = {}): Plugin {
  return {
    postcssPlugin: "postcss-nativewind",
    OnceExit(_, { result }) {
      writeFileSync(
        output,
        `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
          getCreateOptions(result.css)
        )});`
      );
    },
  };
}
plugin.postcss = true as const;

const typeCheck: PluginCreator<NativeWindPostCssPlugin> = plugin;

export default typeCheck;
