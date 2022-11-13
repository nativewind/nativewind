/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, FunctionComponent, ReactElement } from "react";
import type {
  StringToBoolean,
  ClassValue,
  ClassProp,
} from "class-variance-authority/dist/types";
import { Style } from "../transform-css/types";

// Taken from CVA
type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
};
type CVAProps<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

type AdditionalStyledProps<T, P extends keyof T = never> = {
  [key in P]: T[key] | string;
};

export type FunctionComponentWithClassName<T> = FunctionComponent<
  T & {
    className?: string;
    tw?: string;
    ref?: any;
  }
>;

export interface StyledPropOptions {
  name?: string;
  value?: keyof Style;
  class?: boolean;
}

export type StyledOptions<
  T,
  V extends ConfigSchema,
  P extends keyof T = never
> = {
  props?: Partial<Record<string, StyledPropOptions | P | true>>;
  class?: string;

  // From CVA types
  variants?: V;
  defaultVariants?: ConfigVariants<V>;
  compoundVariants?: (V extends ConfigSchema
    ? ConfigVariants<V> & ClassProp
    : ClassProp)[];
};

/**
 * Default
 */
export declare function styled<T>(
  Component: ComponentType<T>,
  defaultClassName?: string
): FunctionComponentWithClassName<T>;
export declare function styled<
  T,
  V extends ConfigSchema,
  P extends keyof T = never
>(
  Component: ComponentType<T>,
  defaultClassName?: string,
  options?: StyledOptions<T, V, P>
): FunctionComponentWithClassName<
  Omit<T, P> & CVAProps<V> & AdditionalStyledProps<T, P>
>;
export declare function styled<T, V extends ConfigSchema, P extends keyof T>(
  Component: ComponentType<T>,
  options: StyledOptions<T, V, P>
): FunctionComponentWithClassName<
  Omit<T, P> & CVAProps<V> & AdditionalStyledProps<T, P>
>;

export declare function StyledComponent<P>(
  props: P & {
    component: React.ComponentType<P>;
    className?: string;
    tw?: string;
  }
): ReactElement<any, any> | null;

export * from "../runtime/web/styled";
