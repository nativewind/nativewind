import type {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  FunctionComponent,
  JSXElementConstructor,
  ReactElement,
} from "react";

import {
  ClassProp,
  ConfigSchema,
  ConfigVariants,
  VariantsConfig,
} from "../variants";

import { Style } from "../../transform-css/types";

type PropsWithRef<T> = ComponentPropsWithRef<ComponentType<T>>;

type StyledProps<T, PAdd extends string, PRemove extends string> = Omit<
  T,
  PRemove
> & { [K in PAdd]?: string };

export type TransformConfigOption<T = string> = {
  name?: T;
  value?: keyof Style;
  class?: boolean;
};

export type TransformConfig<
  T,
  PAdd extends string,
  PRemove extends keyof T & string
> = {
  props?: Record<PAdd, PRemove | true | TransformConfigOption<PRemove>>;
};

export type StyledOptions<
  T,
  C,
  PAdd extends string,
  PRemove extends keyof T & string
> = VariantsConfig<C> & TransformConfig<T, PAdd, PRemove>;

export type Styled = {
  // styled(Text) OR styled(Text, "default")
  <T>(
    component: ComponentType<T>,
    defaultClassName?: string
  ): FunctionComponent<PropsWithRef<T> & ClassProp>;
  // styled(Text, { ...OPTIONS })
  <
    T,
    C extends ConfigSchema,
    PAdd extends string,
    PRemove extends keyof T & string
  >(
    component: ComponentType<T>,
    options: StyledOptions<T, C, PAdd, PRemove>
  ): FunctionComponent<
    StyledProps<PropsWithRef<T>, PAdd, PRemove> & ConfigVariants<C> & ClassProp
  >;
  // styled(Text, "default", { ...OPTIONS })
  <
    T,
    C extends ConfigSchema,
    PAdd extends string,
    PRemove extends keyof T & string
  >(
    component: ComponentType<T>,
    defaultClassName: string,
    options: StyledOptions<T, C, PAdd, PRemove>
  ): FunctionComponent<
    StyledProps<PropsWithRef<T>, PAdd, PRemove> & ConfigVariants<C> & ClassProp
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
