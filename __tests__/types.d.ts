// Mock types for output.tsx files. These don't have to be correct, and are not checked
// They just stop editors complaining when viewing the files :)

declare module "nativewind" {
  export const TailwindProvider: any;
  export const useTailwind: (...arg: any[]) => any;
  export const StyledComponent: FunctionComponent<any>;
  export const NWRuntimeParser: (...arg: any[]) => any;
  export const NativeWindStyleSheet: { create: (obj: any) => void };
}
