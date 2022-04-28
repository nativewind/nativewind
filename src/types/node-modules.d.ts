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
