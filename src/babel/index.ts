import { TailwindReactNativeOptions } from "./types";

import visitor from "./root-visitor";

export default function (
  _: unknown,
  options: TailwindReactNativeOptions,
  cwd: string
) {
  const isProduction =
    typeof __DEV__ !== "undefined"
      ? __DEV__ === true
      : process.env.NODE_ENV === "production";

  const hmr = !isProduction && options.hmr;

  return visitor({ platform: "native", ...options, hmr }, cwd);
}
