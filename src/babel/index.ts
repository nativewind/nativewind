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

  if (platform === "native" && process.env.NODE_ENV === "production") {
    platform = "native-inline";
  } else if (platform === "native") {
    platform = "native-context";
  } else if (!(platform in platformPlugins)) {
    throw new Error(`Unknown platform ${platform}`);
  }

  return platformPlugins[platform as keyof typeof platformPlugins](
    babel,
    options,
    cwd
  );
}
