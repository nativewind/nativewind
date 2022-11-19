/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This was forked from https://github.com/joe-bell/cva
 * License: https://github.com/joe-bell/cva/blob/4039155edfd5007cde0e1c9e0060ed838419f242/LICENSE
 */
type ClassValue = string | null | undefined | ClassValue[];
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type ConfigSchema = Record<string, Record<string, ClassValue>>;

export type ClassProp =
  | { tw?: never; className?: string }
  | { tw?: string; className?: never };

export interface ClassProp2 {
  tw?: string;
  className?: string;
}

export type ConfigVariants<T> = T extends ConfigSchema
  ? {
      [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null;
    }
  : unknown;

export type VariantsConfig<T = unknown> = T extends ConfigSchema
  ? ClassProp & {
      variants?: T;
      defaultProps?: ConfigVariants<T>;
      compoundVariants?: Array<ConfigVariants<T> & ClassProp>;
    }
  : ClassProp;

export type VariantProps<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

type VariantsFunction<T> = (props?: VariantProps<T>) => string;

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
    base: string | string[] | VariantsConfig<T>,
    config?: VariantsConfig<T>
  ) =>
  (props?: VariantProps<T>): string => {
    let baseClassValue: ClassValue;

    if (base && typeof base === "object" && !Array.isArray(base)) {
      config = base;
      baseClassValue = base.className;
    } else {
      baseClassValue = base;
    }

    const variantClassValue: ClassValue = [];
    const propClassValue: ClassValue = props?.tw ?? props?.className;

    if (!config) {
      return joinClasses([baseClassValue, variantClassValue, propClassValue]);
    }

    if (!("variants" in config) && !("compoundVariants" in config)) {
      return joinClasses([baseClassValue, variantClassValue, propClassValue]);
    }

    const { variants, defaultProps, compoundVariants } = config;

    if (variants) {
      for (const variant of Object.keys(variants)) {
        const variantProp = props?.[variant as keyof typeof props];
        if (variantProp === null) continue;

        const variantKey =
          variantProp === undefined
            ? defaultProps?.[variant]?.toString()
            : variantProp.toString();

        if (!variantKey && variants[variant]["false"]) {
          variantClassValue.push(variants[variant]["false"]);
        } else if (variantKey && variants[variant][variantKey]) {
          variantClassValue.push(variants[variant][variantKey]);
        }
      }
    }

    if (!compoundVariants) {
      return joinClasses([baseClassValue, variantClassValue, propClassValue]);
    }

    const mergedProps: VariantProps<T> = {
      ...(defaultProps as VariantProps<T>),
      ...props,
    };

    for (const { className, tw, ...compoundVariant } of compoundVariants) {
      const match = Object.entries(compoundVariant).every(([key, value]) => {
        return typeof value === "boolean"
          ? Boolean(mergedProps[key as keyof VariantProps<T>]) === value
          : mergedProps[key as keyof VariantProps<T>] === value;
      });

      if (match) variantClassValue.push(tw ?? className ?? "");
    }

    return joinClasses([baseClassValue, variantClassValue, propClassValue]);
  };
