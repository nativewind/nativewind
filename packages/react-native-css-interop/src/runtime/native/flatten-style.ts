import { Platform } from "react-native";
import { isRuntimeValue } from "../../shared";
import {
  Interaction,
  RuntimeValue,
  Style,
  StyleMeta,
  StyleProp,
} from "../../types";
import {
  testContainerQuery,
  testMediaQuery,
  testPseudoClasses,
} from "./conditions";
import { globalStyles, rem, styleMetaMap, vh, vw } from "./globals";

export interface FlattenStyleOptions {
  variables: Record<string, any>;
  interaction?: Interaction;
  containers?: Record<string, any>;
  ch?: number;
  cw?: number;
}

/**
 * Reduce a StyleProp to a flat Style object.
 *
 * @remarks
 * As we loop over keys & values, we will resolve any dynamic values.
 * Some values cannot be calculated until the entire style has been flattened.
 * These values are defined as a getter and will be resolved lazily.
 *
 * @param styles The style or styles to flatten.
 * @param options The options for flattening the styles.
 * @param flatStyle The flat style object to add the flattened styles to.
 * @returns The flattened style object.
 */
export function flattenStyle(
  style: StyleProp,
  className: string[] | undefined,
  options: FlattenStyleOptions,
  flatProps: Map<string, Style> = new Map(),
): Map<string, Style> {
  if (className) {
    // Split className string into an array of class names, then map each class
    // name to its corresponding global style object, if one exists.
    const classNameStyle = className
      .map((s) => globalStyles.get(s))
      .filter(Boolean);

    // Combine the resulting array of styles with any existing styles in the `style` property
    // of the input object.
    if (classNameStyle.length > 0) {
      style = Array.isArray(style)
        ? [...classNameStyle, ...style]
        : style
        ? [...classNameStyle, style]
        : classNameStyle;
    }

    // If there is only one style in the resulting array, replace the array with that single style.
    if (Array.isArray(style) && style.length <= 1) {
      style = style[0];
    }
  }

  if (Array.isArray(style)) {
    // We need to flatten in reverse order so that the last style in the array is the one defined
    for (let i = style.length - 1; i >= 0; i--) {
      if (style[i]) {
        flattenStyle(style[i], undefined, options, flatProps);
      }
    }
    return flatProps;
  }

  if (!style) {
    return flatProps;
  }

  /*
   * TODO: Investigate if we early exit if there is no styleMeta.
   */
  const styleMeta: StyleMeta = styleMetaMap.get(style) ?? {};

  let flatStyle: Style;
  let flatStyleMeta: StyleMeta;
  const [prop, propMapping] = styleMeta.prop ?? ["style", true];

  if (!flatProps.has(prop)) {
    flatStyle = {};
    flatStyleMeta = {};
    flatProps.set(prop, flatStyle);
    styleMetaMap.set(flatStyle, flatStyleMeta);
  } else {
    flatStyle = flatProps.get(prop)!;
    flatStyleMeta = styleMetaMap.get(flatStyle)!;
  }

  /*
   * START OF CONDITIONS CHECK
   *
   * If any of these fail, this style and its metadata will be skipped
   */
  if (styleMeta.pseudoClasses) {
    flatStyleMeta.pseudoClasses = {
      ...styleMeta.pseudoClasses,
      ...flatStyleMeta.pseudoClasses,
    };

    if (!testPseudoClasses(options.interaction, styleMeta.pseudoClasses)) {
      return flatProps;
    }
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatProps;
  }

  if (!testContainerQuery(styleMeta.containerQuery, options.containers)) {
    return flatProps;
  }
  /*
   * END OF CONDITIONS CHECK
   */

  if (styleMeta.animations) {
    flatStyleMeta.animations = {
      ...styleMeta.animations,
      ...flatStyleMeta.animations,
    };
  }

  if (styleMeta.transition) {
    flatStyleMeta.transition = {
      ...styleMeta.transition,
      ...flatStyleMeta.transition,
    };
  }

  if (styleMeta.container) {
    flatStyleMeta.container ??= { type: "normal", names: [] };

    if (styleMeta.container.names) {
      flatStyleMeta.container.names = styleMeta.container.names;
    }
    if (styleMeta.container.type) {
      flatStyleMeta.container.type = styleMeta.container.type;
    }
  }

  if (styleMeta.prop) {
    flatStyleMeta.prop = styleMeta.prop;
  }

  if (styleMeta.requiresLayout) {
    flatStyleMeta.requiresLayout = true;
  }

  if (styleMeta.variables) {
    flatStyleMeta.variables ??= {};
    for (const [key, value] of Object.entries(styleMeta.variables)) {
      // Skip already set variables
      if (key in flatStyleMeta.variables) continue;

      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options,
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyleMeta.variables, key, {
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyleMeta.variables[key] = getterOrValue;
      }
    }
  }

  for (const [key, value] of Object.entries(style)) {
    // If there is propMapping, only map the specified styles
    if (typeof propMapping === "string" && key !== propMapping) {
      continue;
    }

    // Skip already set keys
    if (key in flatStyle) continue;

    if (key === "transform") {
      const transforms: Record<string, unknown>[] = [];

      for (const transform of value) {
        // Transform is either an React Native transform object OR
        // A extracted value with type: "function"
        if ("type" in transform) {
          const getterOrValue = extractValue(
            transform,
            flatStyle,
            flatStyleMeta,
            options,
          );

          if (getterOrValue === undefined) {
            continue;
          } else if (typeof getterOrValue === "function") {
            transforms.push(
              Object.defineProperty({}, transform.name, {
                configurable: true,
                enumerable: true,
                get() {
                  return getterOrValue();
                },
              }),
            );
          }
        } else {
          for (const [tKey, tValue] of Object.entries(transform)) {
            const $transform: Record<string, any> = {};

            const getterOrValue = extractValue(
              tValue,
              flatStyle,
              flatStyleMeta,
              options,
            );

            if (typeof getterOrValue === "function") {
              Object.defineProperty($transform, tKey, {
                configurable: true,
                enumerable: true,
                get() {
                  return getterOrValue();
                },
              });
            } else {
              $transform[tKey] = getterOrValue;
            }

            transforms.push($transform);
          }
        }
      }

      flatStyle.transform = transforms as any;
    } else {
      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options,
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyle, key, {
          configurable: true,
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyle[key as keyof Style] = getterOrValue;
      }
    }
  }

  return flatProps;
}

/**
 * Extracts a value from a StyleProp.
 * If the value is a dynamic value, it will be resolved.
 * @param value - The value to extract.
 * @param flatStyle - The flat Style object being built.
 * @param flatStyleMeta - Metadata for the flat Style object.
 * @param options - Options for flattening the StyleProp.
 * @returns The extracted value.
 */
function extractValue(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
): any {
  if (!isRuntimeValue(value)) {
    return value;
  }

  switch (value.name) {
    case "vh":
      return round((vh.get() / 100) * (value.arguments[0] as number));
    case "vw":
      return round((vw.get() / 100) * (value.arguments[0] as number));
    case "var":
      return () => {
        const name = value.arguments[0] as string;
        const resolvedValue =
          flatStyleMeta.variables?.[name] ?? options.variables[name];
        return typeof resolvedValue === "function"
          ? resolvedValue()
          : resolvedValue;
      };
    case "rem":
      return round(rem.get() * (value.arguments[0] as number));
    case "em":
      return () => {
        const multiplier = value.arguments[0] as number;
        if ("fontSize" in flatStyle) {
          return round((flatStyle.fontSize || 0) * multiplier);
        }
        return undefined;
      };
    case "ch": {
      const multiplier = value.arguments[0] as number;

      let reference: number | undefined;

      if (options.ch) {
        reference = options.ch;
      } else if (options.interaction?.layout.height.get()) {
        reference = options.interaction.layout.height.get();
      } else if (typeof flatStyle.height === "number") {
        reference = flatStyle.height;
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (options.interaction?.layout.height.get()) {
            reference = options.interaction.layout.height.get();
          } else if (typeof flatStyle.height === "number") {
            reference = flatStyle.height;
          } else {
            reference = 0;
          }

          return round(reference * multiplier);
        };
      }
    }
    case "cw": {
      const multiplier = value.arguments[0] as number;

      let reference: number | undefined;

      if (options.cw) {
        reference = options.cw;
      } else if (options.interaction?.layout.width.get()) {
        reference = options.interaction.layout.width.get();
      } else if (typeof flatStyle.width === "number") {
        reference = flatStyle.width;
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (options.interaction?.layout.width.get()) {
            reference = options.interaction.layout.width.get();
          } else if (typeof flatStyle.width === "number") {
            reference = flatStyle.width;
          } else {
            reference = 0;
          }

          return round(reference * multiplier);
        };
      }
    }
    case "perspective":
    case "translateX":
    case "translateY":
    case "scaleX":
    case "scaleY":
    case "scale":
      return extractRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        shouldRunwrap: true,
        shouldParseFloat: true,
      });
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "rotateZ":
    case "skewX":
    case "skewY":
      return extractRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        shouldRunwrap: true,
      });
    case "platformSelect":
      return extractValue(
        Platform.select(value.arguments[0]),
        flatStyle,
        flatStyleMeta,
        options,
      );
    default: {
      return extractRuntimeFunction(value, flatStyle, flatStyleMeta, options);
    }
  }
}

function extractRuntimeFunction(
  value: RuntimeValue,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
  { shouldRunwrap = false, shouldParseFloat = false } = {},
) {
  let isStatic = true;
  const args: unknown[] = [];

  for (const arg of value.arguments) {
    const getterOrValue = extractValue(arg, flatStyle, flatStyleMeta, options);

    if (typeof getterOrValue === "function") {
      isStatic = false;
    }

    args.push(getterOrValue);
  }

  const valueFn = () => {
    const $args = args
      .map((a) => (typeof a === "function" ? a() : a))
      .filter((a) => a !== undefined)
      .join(", ");

    if ($args === "") {
      return;
    }

    const result = shouldRunwrap ? $args : `${value.name}(${$args})`;
    return shouldParseFloat ? parseFloat(result) : result;
  };

  return isStatic ? valueFn() : valueFn;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}
