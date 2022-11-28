/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ClassProp } from "../types/styled";

/**
 * This was forked from https://github.com/joe-bell/cva
 * License: https://github.com/joe-bell/cva/blob/4039155edfd5007cde0e1c9e0060ed838419f242/LICENSE
 */
type ClassValue = string | null | undefined | ClassValue[];
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type ConfigSchema = Record<string, Record<string, ClassValue>>;

export type ConfigVariants<T> = T extends ConfigSchema
  ? {
      [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
    }
  : unknown;

export type CompoundVariant<T> =
  | (ConfigVariants<T> & ClassProp)
  | ((props?: Props<T>) => string);

export type VariantsConfig<T = unknown> = T extends ConfigSchema
  ? ClassProp & {
      variants?: T;
      defaultProps?: ConfigVariants<T>;
      compoundVariants?: Array<CompoundVariant<T>>;
    }
  : ClassProp;

export type VariantProps<T> = T extends (props?: infer P) => string
  ? Omit<P, keyof ClassProp>
  : never;

type Props<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

type VariantsFunction<T> = (props?: Props<T>) => string;

export type Variants = {
  <T>(config: VariantsConfig<T>): VariantsFunction<T>;
  <T>(base: string | string[], config?: VariantsConfig<T>): VariantsFunction<T>;
};

export const joinClasses = (classValue: ClassValue): string => {
  // If this is any higher Typescript complains that Array.flat is too deep.
  // If you need more than 21 levels, please raise an issue
  const MAX_SAFE_TYPESCRIPT_FLAT_VALUE = 21;

  return Array.isArray(classValue)
    ? classValue.flat(MAX_SAFE_TYPESCRIPT_FLAT_VALUE).filter(Boolean).join(" ")
    : classValue ?? "";
};

export const variants: Variants =
  <T>(
    baseOrConfig: string | string[] | VariantsConfig<T>,
    config?: VariantsConfig<T>
  ) =>
  (props?: Props<T>): string => {
    let base: ClassValue;

    if (typeof baseOrConfig === "object" && !Array.isArray(baseOrConfig)) {
      config = baseOrConfig;
      base = baseOrConfig.tw ?? baseOrConfig.className;
    } else {
      base = baseOrConfig;
    }

    const variantClassValue: ClassValue = [];
    const propClassValue: ClassValue = props?.tw ?? props?.className;

    if (!config) {
      return joinClasses([base, variantClassValue, propClassValue]);
    }

    if (!("variants" in config) && !("compoundVariants" in config)) {
      return joinClasses([base, variantClassValue, propClassValue]);
    }

    const { variants, defaultProps, compoundVariants } = config;

    const mergedProps: Record<string, unknown> = {
      ...defaultProps,
      ...props,
    };

    if (variants) {
      for (const variant of Object.keys(variants)) {
        const value = mergedProps?.[variant as keyof typeof props];

        if (value === null) continue;

        const key = value?.toString();

        if (value && key && variants[variant][key]) {
          variantClassValue.push(variants[variant][key]);
        } else if (value && variants[variant]["true"]) {
          variantClassValue.push(variants[variant]["true"]);
        } else if (!value && variants[variant]["false"]) {
          variantClassValue.push(variants[variant]["false"]);
        }
      }
    }

    if (!compoundVariants) {
      return joinClasses([base, variantClassValue, propClassValue]);
    }

    for (const compoundVariant of compoundVariants) {
      if (typeof compoundVariant === "function") {
        const match = compoundVariant(props);
        if (match) variantClassValue.push(match);
      } else {
        const { className, tw, ...criteria } = compoundVariant;
        const match = Object.entries(criteria).every(([key, value]) => {
          return typeof value === "boolean"
            ? Boolean(mergedProps[key]) === value
            : mergedProps[key] === value;
        });

        if (match) variantClassValue.push(tw ?? className ?? "");
      }
    }

    return joinClasses([base, variantClassValue, propClassValue]);
  };
