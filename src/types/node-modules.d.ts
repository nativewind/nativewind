/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "postcss-css-variables" {
  export default unknown;
}

declare module "postcss-color-rgb" {
  export default unknown;
}

/**
 * The types for MediaValues are missing 'type'
 */
declare module "css-mediaquery" {
  export function match(
    query: string,
    values: Partial<MediaValues> & { type: string }
  ): boolean;
}

/**
 * Tailwindcss internal functions
 */
declare module "tailwindcss/resolveConfig" {
  export default function (options: unknown): any;
}

declare module "tailwindcss/lib/util/withAlphaVariable" {
  export default function (options: unknown): any;
}

declare module "tailwindcss/lib/util/flattenColorPalette" {
  export default function (options: unknown): any;
}

declare module "tailwindcss/lib/util/toColorValue" {
  export default function (options: unknown): any;
}
