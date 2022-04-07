import { Babel, TailwindReactNativeOptions } from "./types";

import web from "./web";
import nativeInline from "./native-inline";
import nativeContext from "./native-context";

const platformPlugins = {
  web,
  "native-context": nativeContext,
  "native-inline": nativeInline,
};

export default function (
  babel: Babel,
  options: TailwindReactNativeOptions,
  cwd: string
) {
  let { platform = "native" } = options ?? {};

  const isProduction =
    typeof __DEV__ !== "undefined"
      ? __DEV__ === true
      : process.env.NODE_ENV === "production";

  if (platform === "native" && isProduction) {
    platform = "native-context";
  } else if (platform === "native") {
    platform = "native-inline";
  } else if (!(platform in platformPlugins)) {
    throw new Error(`Unknown platform ${platform}`);
  }

  return platformPlugins[platform as keyof typeof platformPlugins](
    babel,
    options,
    cwd
  );
}
