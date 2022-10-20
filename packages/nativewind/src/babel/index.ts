import type { ConfigAPI } from "@babel/core";

import { plugin, PluginOptions } from "./plugin";

export default function (_: ConfigAPI, options: PluginOptions, cwd: string) {
  return {
    plugins: [[plugin, { ...options, cwd }]],
  };
}
