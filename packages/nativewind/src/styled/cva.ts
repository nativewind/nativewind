import type {
  StringToBoolean,
  ClassValue,
  ClassProp,
} from "class-variance-authority/dist/types";

type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
};
export type CVAConfig<T> = T extends ConfigSchema
  ? {
      variants?: T;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? ConfigVariants<T> & ClassProp
        : ClassProp)[];
    }
  : never;
