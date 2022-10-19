import type { ComponentType } from "react";
import type { Style } from "../transform-css/types";

export type PropsWithClassName<T> = T & {
  className?: string;
  tw?: string;
  baseClassName?: string;
  baseTw?: string;
};

export interface StyledOptions<T, P extends keyof T> {
  props?: Partial<Record<P, keyof Style | true>>;
  classProps?: (keyof T & string)[];
  baseClassName?: string;
}

/**
 * Default
 */
export declare function styled<T>(
  Component: ComponentType<T>
): ComponentType<PropsWithClassName<T>>;
/**
 * Base className
 */
export declare function styled<T>(
  Component: ComponentType<T>,
  baseClassName: string
): ComponentType<PropsWithClassName<T>>;
/**
 * Only options
 */
export declare function styled<T, P extends keyof T>(
  Component: ComponentType<T>,
  options: StyledOptions<T, P>
): ComponentType<
  PropsWithClassName<
    T & {
      [key in P]: T[key] | string;
    }
  >
>;
/**
 * Base className w/ options
 */
export declare function styled<T, P extends keyof T>(
  Component: ComponentType<T>,
  baseClassName: string,
  options: StyledOptions<T, P>
): ComponentType<
  PropsWithClassName<
    T & {
      [key in P]: T[key] | string;
    }
  >
>;

export declare function StyledComponent<P>(
  props: PropsWithClassName<P> & {
    component: React.ComponentType<P>;
  }
): React.ReactElement;

export * from "./web";
