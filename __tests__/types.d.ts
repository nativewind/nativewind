// Mock types for output.tsx files. These don't have to be correct, and are not checked
// They just stop editors complaining when viewing the files :)

declare module "nativewind" {
  export const TailwindProvider: any;
  export const useTailwind: (...arg: any[]) => any;
  export const StyledComponent: FunctionComponent<any>;
}

declare module "nativewind/units" {
  export const vw: (...arg: any[]) => any;
}
