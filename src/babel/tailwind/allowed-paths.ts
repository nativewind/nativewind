import { existsSync, lstatSync } from "fs";
import { join } from "path";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import micromatch from "micromatch";

const indexVariations: string[] = [];
for (const file in [
  "index",
  "index.native",
  "index.ios",
  "index.android",
  "index.web",
]) {
  for (const extension in ["js", "jsx", "ts", "tsx"]) {
    indexVariations.push(`${file}.${extension}`);
  }
}

export function getAllowedPaths({ content }: TailwindConfig) {
  if (Array.isArray(content)) {
    return content.length > 0 ? content : "*";
  } else if (content?.files) {
    return content.files.length > 0 ? content.files : "*";
  } else {
    return "*";
  }
}

export function isAllowedPath(
  path: string,
  allowList: string[] | "*",
  dirname: string = ".",
  root: string = `${process.cwd()}/`
) {
  if (allowList === "*") {
    return true;
  }

  /*
   * Tailwindcss resolves content relative to the cwd, not the path
   * of the config file
   *
   * https://github.com/tailwindlabs/tailwindcss/issues/6516
   */

  const pathWithoutRoot = path.replace(root, "");

  const pathVariations =
    existsSync(path) && lstatSync(path).isDirectory()
      ? indexVariations.map((variation) =>
          join(dirname, pathWithoutRoot, `./${variation}`)
        )
      : [pathWithoutRoot];

  for (const variation of pathVariations) {
    for (const glob of allowList) {
      if (micromatch.isMatch(variation, glob)) {
        return true;
      }
    }
  }
}
