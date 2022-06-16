import { TailwindcssReactNativeBabelOptions } from "./types";

import visitor from "./root-visitor";

export default function (
  _: unknown,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  return visitor({ platform: "native", ...options }, cwd);
}
