import tailwindPackage from "tailwindcss/package.json";
import { TailwindCliOptions } from "./types";
import { tailwindCliV3 } from "./v3";

export function tailwindCli(options: TailwindCliOptions): Promise<string> {
  if (tailwindPackage.version.split(".")[0].includes("3")) {
    return tailwindCliV3(options);
  }

  throw new Error("NativeWind only supports Tailwind CSS v3");
}
