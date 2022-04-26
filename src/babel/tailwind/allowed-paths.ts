import micromatch from "micromatch";
import { join, isAbsolute } from "node:path";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { TailwindReactNativeOptions, AllowPathOptions } from "../types";

const defaultContent: NonNullable<TailwindConfig["content"]> = {
  files: ["*"],
  extract: undefined,
  transform: undefined,
};

interface GetAllowedOptionsOptions {
  allowModules: AllowPathOptions;
  allowRelativeModules: AllowPathOptions;
}

export function getAllowedOptions(
  { content = defaultContent }: TailwindConfig,
  { allowModules = "*" }: TailwindReactNativeOptions
): GetAllowedOptionsOptions {
  const contentPaths = Array.isArray(content) ? content : content.files;

  return {
    allowModules: Array.isArray(allowModules)
      ? ["react-native", "react-native-web", ...allowModules]
      : allowModules,
    allowRelativeModules: contentPaths.length === 0 ? "*" : contentPaths,
  };
}

export interface IsAllowedProgramPathOptions {
  path: string;
  allowRelativeModules: AllowPathOptions;
  cwd: string;
}

export function isAllowedProgramPath({
  path,
  allowRelativeModules,
  cwd,
}: IsAllowedProgramPathOptions) {
  if (allowRelativeModules === "*") {
    return true;
  }

  return allowRelativeModules.some((modulePath) => {
    return isAbsolute(modulePath)
      ? micromatch.isMatch(path, modulePath)
      : micromatch.isMatch(path, join(cwd, modulePath));
  });
}
