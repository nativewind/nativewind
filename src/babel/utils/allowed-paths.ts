import micromatch from "micromatch";
import { join, isAbsolute } from "node:path";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { TailwindcssReactNativeBabelOptions, AllowPathOptions } from "../types";

const defaultContent: NonNullable<TailwindConfig["content"]> = {
  files: ["*"],
  extract: undefined,
  transform: undefined,
};

interface GetAllowedOptionsOptions {
  allowModuleTransform: AllowPathOptions;
  allowRelativeModules: AllowPathOptions;
}

export function getAllowedOptions(
  { content = defaultContent }: TailwindConfig,
  { allowModuleTransform = "*" }: TailwindcssReactNativeBabelOptions
): GetAllowedOptionsOptions {
  const contentPaths = Array.isArray(content) ? content : content.files;

  return {
    allowModuleTransform: Array.isArray(allowModuleTransform)
      ? ["react-native", "react-native-web", ...allowModuleTransform]
      : allowModuleTransform,
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
