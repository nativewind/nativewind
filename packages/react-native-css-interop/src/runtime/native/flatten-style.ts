import {
  TransformsStyle,
  Platform,
  PixelRatio,
  PlatformColor,
} from "react-native";
import {
  testPseudoClasses,
  testMediaQuery,
  testContainerQuery,
} from "./conditions";
import type { InteropComputed } from "./interop";
import { RuntimeValue, Style, StyleMeta, StyleProp } from "../../types";
import { StyleSheet } from "./stylesheet";
import { isRuntimeValue } from "../../shared";
import { rem } from "./rem";
import { styleMetaMap, vh, vw } from "./misc";

type FlattenStyleOptions = {
  ch?: number;
  cw?: number;
};

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
  interop: InteropComputed,
  options: FlattenStyleOptions = {},
  flatStyle?: Style,
  depth = 0,
): Style {
  flatStyle ||= {};
  if (!style) {
    return flatStyle;
  }

  if (Array.isArray(style)) {
    // Only inline styles are at depth > 1
    // We can shortcut processing them by reversing the array
    // Styles at depth=1 are already reversed due to specificity sorting
    if (depth > 1 && style.length > 1) {
      style.reverse();
    }
    for (const s of style) {
      flattenStyle(s, interop, options, flatStyle, depth + 1);
    }
    return flatStyle;
  }

  /*
   * TODO: Investigate if we early exit if there is no styleMeta.
   */
  const styleMeta: StyleMeta = styleMetaMap.get(style) ?? {
    specificity: { inline: 1 },
  };
  let flatStyleMeta = styleMetaMap.get(flatStyle);

  if (!flatStyleMeta) {
    flatStyleMeta = { alreadyProcessed: true, specificity: { inline: 1 } };
    styleMetaMap.set(flatStyle, flatStyleMeta);
  }

  // If the style can have variables or containers, we need to wrap it in a context
  flatStyleMeta.wrapInContext ||= Boolean(
    styleMeta.variables || styleMeta.container,
  );

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

    if (!testPseudoClasses(interop, styleMeta.pseudoClasses)) {
      return flatStyle;
    }
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatStyle;
  }

  if (
    styleMeta.containerQuery &&
    !testContainerQuery(styleMeta.containerQuery, interop)
  ) {
    return flatStyle;
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

  if (styleMeta.container?.names) {
    flatStyleMeta.requiresLayout = true;
    for (const name of styleMeta.container.names) {
      interop.setContainer(name);
    }
  }

  if (styleMeta.requiresLayout) {
    flatStyleMeta.requiresLayout = true;
  }

  if (styleMeta.variables) {
    for (const [key, value] of Object.entries(styleMeta.variables)) {
      if (depth <= 1 && interop.hasVariable(key)) {
        continue;
      }

      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        interop,
        options,
      );

      interop.setVariable(key, getterOrValue);
    }
  }

  for (let [key, value] of Object.entries(style)) {
    if (
      // We can shortcut setting a value if it already exists
      value === undefined ||
      flatStyle[key as keyof typeof flatStyle] !== undefined
    ) {
      continue;
    }

    switch (key) {
      case "transform": {
        const transforms: Record<string, unknown>[] = [];

        for (const transform of value) {
          // Transform is either an React Native transform object OR
          // A extracted value with type: "function"
          if ("type" in transform) {
            const getterOrValue = extractValue(
              transform,
              flatStyle,
              flatStyleMeta,
              interop,
              options,
            );

            if (typeof getterOrValue === "function") {
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
              const $transform: Record<string, unknown> = {};

              const getterOrValue = extractValue(
                tValue,
                flatStyle,
                flatStyleMeta,
                interop,
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

        flatStyle.transform =
          transforms as unknown as TransformsStyle["transform"];
        break;
      }
      case "textShadow": {
        extractAndDefineProperty(
          "textShadow.width",
          value[0],
          flatStyle,
          flatStyleMeta,
          interop,
          options,
        );
        extractAndDefineProperty(
          "textShadow.height",
          value[1],
          flatStyle,
          flatStyleMeta,
          interop,
          options,
        );
        break;
      }
      case "shadowOffset": {
        extractAndDefineProperty(
          "shadowOffset.width",
          value[0],
          flatStyle,
          flatStyleMeta,
          interop,
          options,
        );
        extractAndDefineProperty(
          "shadowOffset.height",
          value[1],
          flatStyle,
          flatStyleMeta,
          interop,
          options,
        );
        break;
      }
      default:
        extractAndDefineProperty(
          key,
          value,
          flatStyle,
          flatStyleMeta,
          interop,
          options,
        );
    }
  }

  return flatStyle;
}

function extractAndDefineProperty(
  key: string,
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  effect: InteropComputed,
  options: FlattenStyleOptions = {},
) {
  const getterOrValue = extractValue(
    value,
    flatStyle,
    flatStyleMeta,
    effect,
    options,
  );

  if (getterOrValue === undefined) return;

  if (key.includes(".")) {
    // Some native props can be nested in objects
    const tokens = key.split(".");
    let target = flatStyle as any;

    for (const [index, token] of tokens.entries()) {
      if (index === tokens.length - 1) {
        if (typeof getterOrValue === "function") {
          Object.defineProperty(target, token, {
            configurable: true,
            enumerable: true,
            get: getterOrValue,
          });
        } else {
          Object.defineProperty(target, token, {
            configurable: true,
            enumerable: true,
            value: getterOrValue,
          });
        }
      } else {
        target[token] ??= {};
        target = target[token];
      }
    }

    return flatStyle;
  } else if (typeof getterOrValue === "function") {
    Object.defineProperty(flatStyle, key, {
      configurable: true,
      enumerable: true,
      get: getterOrValue,
    });
  } else {
    Object.defineProperty(flatStyle, key, {
      configurable: true,
      enumerable: true,
      value: getterOrValue,
    });
  }
}

function extractValue(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  effect: InteropComputed,
  options: FlattenStyleOptions = {},
): any {
  if (!isRuntimeValue(value)) {
    return value;
  }

  switch (value.name) {
    case "var": {
      const name = value.arguments[0] as string;

      return () => {
        return effect.runInEffect(() => {
          const resolvedValue = extractValue(
            effect.getVariable(name),
            flatStyle,
            flatStyleMeta,
            effect,
            options,
          );

          return typeof resolvedValue === "function"
            ? resolvedValue()
            : resolvedValue;
        });
      };
    }
    case "vh": {
      return round((vh.get() / 100) * (value.arguments[0] as number));
    }
    case "vw": {
      return round((vw.get() / 100) * (value.arguments[0] as number));
    }
    case "rem": {
      return round(rem.get() * (value.arguments[0] as number));
    }
    case "em": {
      return () => {
        const multiplier = value.arguments[0] as number;
        if ("fontSize" in flatStyle) {
          return round((flatStyle.fontSize || 0) * multiplier);
        }
        return;
      };
    }
    case "ch": {
      const multiplier = value.arguments[0] as number;

      let reference: number | undefined;

      if (options.ch) {
        reference = options.ch;
      } else if (typeof flatStyle.height === "number") {
        reference = flatStyle.height;
      } else {
        reference = effect.getInteraction("layoutHeight").get();
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (typeof flatStyle.height === "number") {
            reference = flatStyle.height;
          } else {
            reference = effect.getInteraction("layoutHeight").get() ?? 0;
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
      } else if (typeof flatStyle.width === "number") {
        reference = flatStyle.width;
      } else {
        reference = effect.getInteraction("layoutWidth").get();
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (typeof flatStyle.width === "number") {
            reference = flatStyle.width;
          } else {
            reference = effect.getInteraction("layoutWidth").get() ?? 0;
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
    case "scale": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
        },
      );
    }
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "rotateZ":
    case "skewX":
    case "skewY": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
          parseFloat: false,
          zeroDefault: "0deg",
        },
      );
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }

    case "platformSelect": {
      return createRuntimeFunction(
        {
          ...value,
          arguments: [Platform.select(value.arguments[0])],
        },
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
        },
      );
    }
    case "fontScaleSelect": {
      const specifics = value.arguments[0];
      const pixelRatio = PixelRatio.getFontScale();
      const match =
        specifics[pixelRatio] ?? specifics["native"] ?? specifics["default"];

      if (match === undefined) return;

      return createRuntimeFunction(
        {
          ...value,
          arguments: [match],
        },
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
        },
      );
    }
    case "pixelScaleSelect": {
      const specifics = value.arguments[0];
      const pixelRatio = PixelRatio.get();
      const match =
        specifics[pixelRatio] ?? specifics["native"] ?? specifics["default"];

      if (match === undefined) return;

      return createRuntimeFunction(
        {
          ...value,
          arguments: [match],
        },
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
        },
      );
    }
    case "platformColor": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
          joinArgs: false,
          callback: PlatformColor,
          spreadCallbackArgs: true,
        },
      );
    }
    case "pixelScale": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
          callback: (value: number) => PixelRatio.get() * value,
        },
      );
    }
    case "fontScale": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
          callback: (value: number) => PixelRatio.getFontScale() * value,
        },
      );
    }
    case "getPixelSizeForLayoutSize": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
          callback: (value: number) =>
            PixelRatio.getPixelSizeForLayoutSize(value),
        },
      );
    }
    case "roundToNearestPixel": {
      return createRuntimeFunction(
        {
          ...value,
          arguments: [PixelRatio.roundToNearestPixel(value.arguments[0])],
        },
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          wrap: false,
        },
      );
    }
    case "rgb": {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
        {
          joinArgs: false,
          callback(value: any) {
            const args = value.slice(4, -1).split(",");

            if (args.length === 4) {
              return `rgba(${args.join(",")})`;
            }
            return value;
          },
        },
      );
    }
    default: {
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
      );
    }
  }
}

interface CreateRuntimeFunctionOptions {
  wrap?: boolean;
  parseFloat?: boolean;
  joinArgs?: boolean;
  callback?: Function;
  spreadCallbackArgs?: boolean;
  zeroDefault?: any;
}

/**
 * TODO: This function is overloaded with functionality
 */
function createRuntimeFunction(
  value: RuntimeValue,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  effect: InteropComputed,
  options: FlattenStyleOptions,
  {
    wrap = true,
    parseFloat: shouldParseFloat = true,
    joinArgs: joinArguments = true,
    spreadCallbackArgs: spreadCallbackArguments = false,
    zeroDefault,
    callback,
  }: CreateRuntimeFunctionOptions = {},
) {
  let isStatic = true;
  const args: unknown[] = [];

  if (value.arguments) {
    for (const argument of value.arguments) {
      const getterOrValue = extractValue(
        argument,
        flatStyle,
        flatStyleMeta,
        effect,
        options,
      );

      if (typeof getterOrValue === "function") {
        isStatic = false;
      }

      args.push(getterOrValue);
    }
  }

  const valueFn = () => {
    let $args: any = args
      .map((a) => (typeof a === "function" ? a() : a))
      .filter((a) => a !== undefined);

    if (joinArguments) {
      $args = $args.join(", ");

      if ($args === "") {
        return;
      }
    }

    let result = wrap ? `${value.name}(${$args})` : $args;

    if (shouldParseFloat) {
      const float = Number.parseFloat(result);

      if (!Number.isNaN(float) && float.toString() === result) {
        result = float;
      }
    }

    if (zeroDefault && result === "0") {
      result = zeroDefault;
    }

    if (callback) {
      if (spreadCallbackArguments && Array.isArray(result)) {
        return callback(...result);
      } else {
        return callback(result);
      }
    }

    return result;
  };

  return isStatic ? valueFn() : valueFn;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}
