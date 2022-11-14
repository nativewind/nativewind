import type {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  FunctionComponent,
  JSXElementConstructor,
  ReactElement,
} from "react";

import { ClassProp, ConfigVariants, VariantsConfig } from "../variants";

import { Style } from "../../transform-css/types";

type PropsWithRef<T> = ComponentPropsWithRef<ComponentType<T>>;

export type TransformConfigOption<T = string> = {
  name?: T;
  value?: keyof Style;
  class?: boolean;
};

export type TransformAdd<TTransform> =
  TTransform extends TransformSchema<string>
    ? { [K in keyof TTransform]?: string }
    : unknown;

export type TransformRemove<T> =
  | TransformRemoveBoolean<T>
  | TransformRemoveAlias<T>;

export type TransformRemoveBoolean<T> = T extends Record<infer V, true>
  ? V extends string
    ? V
    : never
  : never;

export type TransformRemoveAlias<T> = T extends Record<
  string,
  infer V | true | TransformConfigOption<infer V>
>
  ? V extends string
    ? V
    : never
  : never;

export type TransformSchema<T extends string = string> = Record<
  string,
  T | true | TransformConfigOption<T>
>;

export type TransformConfig<T> = {
  props?: TransformSchema<keyof T & string>;
};
export type InferTransform<T> = T extends TransformSchema
  ? { props?: T }
  : unknown;

export type StyledOptions<T, TVariants> = VariantsConfig<TVariants> &
  TransformConfig<T>;

export type Styled = {
  // styled(Text) OR styled(Text, "default")
  <T>(
    component: ComponentType<T>,
    defaultClassName?: string
  ): FunctionComponent<PropsWithRef<T> & ClassProp>;
  // styled(Text, { ...OPTIONS })
  <T, TVariants, TTransform>(
    component: ComponentType<T>,
    options: StyledOptions<T, TVariants> & InferTransform<TTransform>
  ): FunctionComponent<
    Omit<PropsWithRef<T>, TransformRemove<TTransform>> &
      ConfigVariants<TVariants> &
      TransformAdd<TTransform>
  >;
  // styled(Text, "default", { ...OPTIONS })
  <T, TVariants, TTransform>(
    component: ComponentType<T>,
    defaultClassName: string,
    options: StyledOptions<T, TVariants> & InferTransform<TTransform>
  ): FunctionComponent<
    Omit<PropsWithRef<T>, TransformRemove<TTransform>> &
      ConfigVariants<TVariants> &
      TransformAdd<TTransform>
  >;
};

export type StyledComponent = {
  <T extends JSXElementConstructor<any>, P = ComponentProps<T>>(
    props: P &
      ClassProp & {
        component: ComponentType<T>;
      }
  ): ReactElement<P, T> | null;
};
