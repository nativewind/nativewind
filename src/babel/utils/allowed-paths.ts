import micromatch from "micromatch";
import { resolve, sep, posix } from "node:path";
import { Config } from "tailwindcss";
import { TailwindcssReactNativeBabelOptions, AllowPathOptions } from "../types";

const defaultContent: NonNullable<Config["content"]> = {
  files: ["*"],
  extract: undefined,
  transform: undefined,
};

interface GetAllowedOptionsOptions {
  allowModuleTransform: AllowPathOptions;
  allowRelativeModules: AllowPathOptions;
}

export function getAllowedOptions(
  { content = defaultContent }: Config,
  { allowModuleTransform = "*" }: TailwindcssReactNativeBabelOptions
): GetAllowedOptionsOptions {
  const contentPaths = (
    Array.isArray(content) ? content : content.files
  ).filter((a): a is string => typeof a === "string");

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

  /**
   * This is my naive way to get path matching working on Windows.
   * Basically I turn it into a posix path which seems to work fine
   *
   * If you are a windows user and understand micromatch, can you please send a PR
   * to do this the proper way
   */
  const posixPath = path.split(sep).join(posix.sep);

  return allowRelativeModules.some((modulePath) => {
    return micromatch.isMatch(
      posixPath,
      resolve(cwd, modulePath).split(sep).join(posix.sep)
    );
  });
}
