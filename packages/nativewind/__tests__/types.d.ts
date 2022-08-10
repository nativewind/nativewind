// Mock types for output.tsx files. These don't have to be correct, and are not checked
// They just stop editors complaining when viewing the files :)

declare module "nativewind" {
  export const useTailwind: (...arg: any[]) => any;
  export const StyledComponent: FunctionComponent<any>;
  export const NWRuntimeParser: (...arg: any[]) => any;
  export const NativeWindStyleSheet: {
    create: (obj: any) => void;
    hairlineWidth: () => void;
    platformColor: (color: string) => string;
    platformSelect: <T>(value: Record<string, T>) => T;
    roundToNearestPixel: (n: number) => number;
    parse: (key: string, value: unknown) => void;
  };

  /*
   * Theme functions
   */
  export const platformSelect: (n: unknown) => string;
  export const hairlineWidth: () => string;
  export const platformColor: (color: string) => string;
  export const roundToNearestPixel: (n: number) => string;
}
