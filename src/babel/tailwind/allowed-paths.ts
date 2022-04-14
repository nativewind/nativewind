import micromatch from "micromatch";
import { join, isAbsolute } from "path";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { TailwindReactNativeOptions, AllowPathOptions } from "../types";

const defaultContent: NonNullable<TailwindConfig["content"]> = {
  files: ["*"],
  extract: undefined,
  transform: undefined,
};

export function getAllowedPaths(
  { content = defaultContent }: TailwindConfig,
  { allowModules = "*" }: TailwindReactNativeOptions
): {
  allowModules: AllowPathOptions;
  allowRelativeModules: AllowPathOptions;
} {
  const contentPaths = Array.isArray(content) ? content : content.files;

  /*
   * Tailwindcss resolves content relative to the cwd (https://github.com/tailwindlabs/tailwindcss/issues/6516)
   *
   * We join the contentPath with the cwd to make globbing of relative files easier
   */
  return {
    allowModules,
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
    if (isAbsolute(modulePath)) {
      return micromatch.isMatch(path, modulePath);
    } else {
      return micromatch.isMatch(path, join(cwd, modulePath));
    }
  });
}
