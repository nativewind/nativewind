import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FunctionComponent,
  ReactElement,
} from "react";

import {
  ClassProp,
  ClassProp2,
  ConfigVariants,
  VariantsConfig,
} from "../variants";

import { Style } from "../../transform-css/types";

type StringKeys<T> = Extract<keyof T, string>;

export type TransformConfigOption<T = string> = {
  name?: T;
  value?: keyof Style;
  class?: boolean;
};

type TransformProps<T, TTransform> = Record<keyof TTransform, string> &
  Omit<T, Extract<keyof T, keyof TransformMapping<TTransform>>>;

export type TransformMapping<TTransform> = {
  [Key in keyof TTransform as InferTransformAlias<Key, TTransform[Key]>]: Key;
};

type InferTransformAlias<K, V> = K extends string
  ? V extends true
    ? K
    : V extends string
    ? V
    : V extends { name: infer N }
    ? N extends string
      ? N
      : never
    : V extends Record<string, unknown>
    ? K
    : never
  : never;

type SetOptional<T, K extends string> = Omit<T, Extract<K, keyof T>> &
  Partial<Pick<T, Extract<K, keyof T>>>;

type OptionalProps<T> = Exclude<
  {
    [Key in keyof T]: T extends Record<Key, T[Key]> ? never : Key;
  }[keyof T],
  undefined
>;

export type TransformSchema<T> = Record<
  string,
  T | true | TransformConfigOption<T>
>;

export type InferTransform<T, TTransform> = T extends TransformSchema<T>
  ? { props?: TTransform }
  : unknown;

export type InferDefaultProps<TDefaultProps, T, TVariants, TTransform> =
  TDefaultProps extends Record<string, unknown>
    ? { defaultProps?: DefaultProps<T, TVariants, TTransform> }
    : unknown;

type DefaultProps<T, TVariants, TTransform> = Partial<
  TransformProps<T, TTransform> | ConfigVariants<TVariants>
>;

export type StyledOptions<T, TVariants, TTransform, TDefaultProps> =
  VariantsConfig<TVariants> & {
    props?: TTransform & TransformSchema<keyof T>;
    defaultProps?: TDefaultProps & DefaultProps<T, TVariants, TTransform>;
    compoundVariants?: Array<
      { [K in keyof T]?: T[K] | boolean } & ClassProp &
        ConfigVariants<TVariants>
    >;
  };

type OptionalTransformProps<T, TTransform> = Extract<
  TransformMapping<TTransform>[Extract<
    keyof TransformMapping<TTransform>,
    OptionalProps<T>
  >],
  string
>;

export type StyledComponentProps<T, TVariants, TTransform, TDefaultProps> =
  SetOptional<
    TransformProps<T, TTransform> & ConfigVariants<TVariants> & ClassProp2,
    StringKeys<TDefaultProps> | OptionalTransformProps<T, TTransform>
  >;

export type StyledFunctionComponent<
  T extends ElementType,
  TVariants = unknown,
  TTransform = unknown,
  TDefaultProps = unknown
> = FunctionComponent<
  StyledComponentProps<
    ComponentPropsWithRef<T>,
    TVariants,
    TTransform,
    TDefaultProps
  >
>;

export type Styled = {
  // styled(Text) OR styled(Text, "default")
  <T extends ElementType>(
    component: T,
    defaultClassName?: string
  ): StyledFunctionComponent<T>;
  // styled(Text, { ...OPTIONS })
  <T extends ElementType, TVariants, TTransform, TDefaultProps>(
    component: T,
    options: StyledOptions<
      ComponentPropsWithoutRef<T>,
      TVariants,
      TTransform,
      TDefaultProps
    >
  ): StyledFunctionComponent<T, TVariants, TTransform, TDefaultProps>;
  // styled(Text, "default", { ...OPTIONS })
  <T extends ElementType, TVariants, TTransform, TDefaultProps>(
    component: T,
    defaultClassName: string,
    options: StyledOptions<
      ComponentPropsWithoutRef<T>,
      TVariants,
      TTransform,
      TDefaultProps
    >
  ): StyledFunctionComponent<T, TVariants, TTransform, TDefaultProps>;
};

export type StyledComponentType = {
  <T>(
    props: T &
      ClassProp & {
        component: ElementType<T>;
      }
  ): ReactElement<T>;
};

export type AnyStyledOptions = StyledOptions<any, any, any, any>;
