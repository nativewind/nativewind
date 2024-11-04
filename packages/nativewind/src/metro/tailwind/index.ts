import { Debugger } from "debug";
import tailwindPackage from "tailwindcss/package.json";

import { tailwindCliV3, tailwindConfigV3 } from "./v3";

const isV3 = tailwindPackage.version.split(".")[0].includes("3");

export function tailwindCli(debug: Debugger) {
  if (isV3) {
    return tailwindCliV3(debug);
  }

  throw new Error("NativeWind only supports Tailwind CSS v3");
}

export function tailwindConfig(path: string) {
  if (isV3) {
    return tailwindConfigV3(path);
  } else {
    throw new Error("NativeWind only supports Tailwind CSS v3");
  }
}
