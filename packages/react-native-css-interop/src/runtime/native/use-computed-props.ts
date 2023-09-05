import { useContext, useMemo, useRef } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
  PlatformColor,
  StyleSheet,
  TargetedEvent,
  TransformsStyle,
} from "react-native";

import {
  ContainerRuntime,
  Interaction,
  InteropFunctionOptions,
  InteropMeta,
  JSXFunction,
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
import { isRuntimeValue } from "../../shared";
import { createSignal, useComputation } from "../signals";
import { ContainerContext, styleMetaMap, vh, vw } from "./misc";
import { VariableContext, defaultVariables, rootVariables } from "./variables";
import { rem } from "./rem";
import { styleSpecificityCompareFn } from "../specificity";
import { devForceReload } from "./stylesheet";

type UseStyledPropsOptions = InteropFunctionOptions<Record<string, unknown>>;

/**
 * Create a computation that will flatten the className and generate a interopMeta
 * Any signals read while the computation is running will be subscribed to.
 *
 * useComputation handles the reactivity/memoization
 * flattenStyle handles converting the classNames collecting the metadata
 */
export function useStyledProps<P extends Record<string, any>>(
  $props: P,
  jsx: JSXFunction<P>,
  options: UseStyledPropsOptions,
  rerender: () => void,
) {
  const propsRef = useRef<P>($props);
  propsRef.current = $props;

  const inheritedContainers = useContext(ContainerContext);
  const inheritedVariables = useContext(VariableContext);

  const computedVariables = useComputation(
    () => {
      devForceReload.get();
      // $variables will be null if this is a top-level component
      if (inheritedVariables === null) {
        return rootVariables.get();
      } else {
        return {
          ...inheritedVariables,
          ...defaultVariables.get(),
        };
      }
    },
    [inheritedVariables],
    rerender,
  );

  const interaction = useMemo<Interaction>(
    () => ({
      active: createSignal(false),
      hover: createSignal(false),
      focus: createSignal(false),
      layout: {
        width: createSignal<number>(0),
        height: createSignal<number>(0),
      },
    }),
    [],
  );

  return useComputation(
    () => {
      devForceReload.get();
      return getStyledProps(
        propsRef.current,
        computedVariables,
        inheritedContainers,
        interaction,
        jsx,
        options,
      );
    },
    [computedVariables, inheritedContainers, ...options.dependencies],
    rerender,
  );
}

/**
 * TODO: This is the main logic for the library, we should unit test this function directly
 *
 * It is separated so it can be tested outside of ReactJS
 */
export function getStyledProps<P extends Record<string, any>>(
  propsRef: P,
  computedVariables: Record<string, unknown>,
  inheritedContainers: Record<string, ContainerRuntime>,
  interaction: Interaction,
  jsx: JSXFunction<P>,
  options: UseStyledPropsOptions,
) {
  const styledProps: Record<string, any> = {};
  const variables = { ...computedVariables };
  const containers: Record<string, ContainerRuntime> = {};
  const animatedProps = new Set<string>();
  const transitionProps = new Set<string>();

  let hasInlineVariables = false;
  let hasInlineContainers = false;
  let requiresLayout = false;
  let hasActive: boolean | undefined = false;
  let hasHover: boolean | undefined = false;
  let hasFocus: boolean | undefined = false;

  for (const [key, config] of options.configMap) {
    if (config === false) {
      continue;
    }

    const flatStyle = flattenStyle(propsRef[key], {
      ...options,
      interaction,
      variables: computedVariables,
      containers: inheritedContainers,
    });

    const meta = styleMetaMap.get(flatStyle);

    if (meta) {
      if (meta.variables) {
        Object.assign(variables, meta.variables);
        hasInlineVariables = true;
      }

      if (meta.container?.names) {
        hasInlineContainers = true;
        const runtime: ContainerRuntime = {
          type: "normal",
          interaction,
          style: flatStyle,
        };

        containers.__default = runtime;
        for (const name of meta.container.names) {
          containers[name] = runtime;
        }
      }

      if (meta.animations) animatedProps.add(key);
      if (meta.transition) transitionProps.add(key);

      requiresLayout ||= Boolean(hasInlineContainers || meta.requiresLayout);
      hasActive ||= Boolean(hasInlineContainers || meta.pseudoClasses?.active);
      hasHover ||= Boolean(hasInlineContainers || meta.pseudoClasses?.hover);
      hasFocus ||= Boolean(hasInlineContainers || meta.pseudoClasses?.focus);
    }

    /**
     * Map the flatStyle to the correct prop and/or move style properties to props (nativeStyleToProp)
     *
     * Note: We freeze the flatStyle as many of its props are getter's without a setter
     *  Freezing the whole object keeps everything consistent
     */
    if (
      config === true ||
      typeof config === "string" ||
      config?.nativeStyleToProp === undefined
    ) {
      styledProps[key] = Object.freeze(flatStyle);
    } else {
      for (const [styleKey, targetProp] of Object.entries(
        config.nativeStyleToProp,
      ) as [keyof Style, boolean | keyof P][]) {
        if (targetProp === true && flatStyle[styleKey]) {
          styledProps[styleKey] = flatStyle[styleKey];
          delete flatStyle[styleKey];
        }

        if (config.target) {
          if (config.target === true) {
            styledProps[key] = Object.freeze(flatStyle);
          } else {
            styledProps[config.target] = Object.freeze(flatStyle);
          }
        }
      }
    }
  }

  let animationInteropKey: string | undefined;
  if (animatedProps.size > 0 || transitionProps.size > 0) {
    animationInteropKey = [...animatedProps, ...transitionProps].join(":");
  }

  if (requiresLayout) {
    styledProps.onLayout = (event: LayoutChangeEvent) => {
      propsRef.onLayout?.(event);
      interaction.layout.width.set(event.nativeEvent.layout.width);
      interaction.layout.height.set(event.nativeEvent.layout.height);
    };
  }

  let convertToPressable = false;
  if (hasActive) {
    convertToPressable = true;
    styledProps.onPressIn = (event: GestureResponderEvent) => {
      propsRef.onPressIn?.(event);
      interaction.active.set(true);
    };
    styledProps.onPressOut = (event: GestureResponderEvent) => {
      propsRef.onPressOut?.(event);
      interaction.active.set(false);
    };
  }
  if (hasHover) {
    convertToPressable = true;
    styledProps.onHoverIn = (event: MouseEvent) => {
      propsRef.onHoverIn?.(event);
      interaction.hover.set(true);
    };
    styledProps.onHoverOut = (event: MouseEvent) => {
      propsRef.onHoverIn?.(event);
      interaction.hover.set(false);
    };
  }
  if (hasFocus) {
    convertToPressable = true;
    styledProps.onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      propsRef.onFocus?.(event);
      interaction.focus.set(true);
    };
    styledProps.onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      propsRef.onBlur?.(event);
      interaction.focus.set(false);
    };
  }

  const meta: InteropMeta = {
    animatedProps,
    animationInteropKey,
    containers,
    convertToPressable,
    hasInlineContainers,
    hasInlineVariables,
    inheritedContainers,
    interaction,
    transitionProps,
    variables,
    requiresLayout,
    jsx,
  };

  return {
    styledProps,
    meta,
  };
}

type FlattenStyleOptions = {
  variables: Record<string, unknown>;
  containers: Record<string, ContainerRuntime>;
  interaction: Interaction;
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
  options: FlattenStyleOptions,
  flatStyle: Style = {},
): Style {
  if (!style) {
    return flatStyle;
  }

  if (Array.isArray(style)) {
    for (const s of style.flat().sort(styleSpecificityCompareFn)) {
      flattenStyle(s, options, flatStyle);
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

  /**
   * If any style (even ones that don't pass the condition check check)
   * have variables, then we need to have a variable key. This is to ensure
   * VariableProvider is always added to the render tree, even if the styles are
   * not currently valid.
   *
   * This will prevent an unmount of components when styles with variables are suddenly valid
   */
  if (styleMeta.variables) {
    flatStyleMeta.variables ??= {};
  }

  // TODO: We should probably do this for containers as well, but I'm not sure we even want to
  //       support conditional containers.

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
      return flatStyle;
    }
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatStyle;
  }

  if (!testContainerQuery(styleMeta.containerQuery, options.containers)) {
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

  if (styleMeta.container) {
    flatStyleMeta.container ??= { type: "normal", names: [] };

    if (styleMeta.container.names) {
      flatStyleMeta.container.names = styleMeta.container.names;
    }
    if (styleMeta.container.type) {
      flatStyleMeta.container.type = styleMeta.container.type;
    }
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

      Object.defineProperty(flatStyleMeta.variables, key, {
        enumerable: true,
        get() {
          return typeof getterOrValue === "function"
            ? getterOrValue()
            : getterOrValue;
        },
      });
    }
  }

  for (let [key, value] of Object.entries(style)) {
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
              const $transform: Record<string, unknown> = {};

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
          options,
        );
        extractAndDefineProperty(
          "textShadow.height",
          value[1],
          flatStyle,
          flatStyleMeta,
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
          options,
        );
        extractAndDefineProperty(
          "shadowOffset.height",
          value[1],
          flatStyle,
          flatStyleMeta,
          options,
        );
        break;
      }
      default:
        extractAndDefineProperty(key, value, flatStyle, flatStyleMeta, options);
    }
  }

  return flatStyle;
}

function extractAndDefineProperty(
  key: string,
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
) {
  const getterOrValue = extractValue(value, flatStyle, flatStyleMeta, options);

  if (getterOrValue === undefined) return;

  const tokens = key.split(".");
  let target = flatStyle as any;

  for (const [index, token] of tokens.entries()) {
    if (index === tokens.length - 1) {
      Object.defineProperty(target, token, {
        configurable: true,
        enumerable: true,
        get() {
          return typeof getterOrValue === "function"
            ? getterOrValue()
            : getterOrValue;
        },
      });
    } else {
      target[token] ??= {};
      target = target[token];
    }
  }
}

function extractValue<T>(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
): any {
  if (!isRuntimeValue(value)) {
    return value;
  }

  switch (value.name) {
    case "vh": {
      return round((vh.get() / 100) * (value.arguments[0] as number));
    }
    case "vw": {
      return round((vw.get() / 100) * (value.arguments[0] as number));
    }
    case "var": {
      return () => {
        const name = value.arguments[0] as string;
        const resolvedValue = extractValue(
          flatStyleMeta.variables?.[name] ?? options.variables[name],
          flatStyle,
          flatStyleMeta,
          options,
        );

        return typeof resolvedValue === "function"
          ? resolvedValue()
          : resolvedValue;
      };
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
    case "scale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
      });
    }
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "rotateZ":
    case "skewX":
    case "skewY": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        parseFloat: false,
      });
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
        options,
        {
          wrap: false,
        },
      );
    }
    case "platformColor": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        joinArgs: false,
        callback: PlatformColor,
        spreadCallbackArgs: true,
      });
    }
    case "pixelScale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) => PixelRatio.get() * value,
      });
    }
    case "fontScale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) => PixelRatio.getFontScale() * value,
      });
    }
    case "getPixelSizeForLayoutSize": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) =>
          PixelRatio.getPixelSizeForLayoutSize(value),
      });
    }
    case "roundToNearestPixel": {
      return createRuntimeFunction(
        {
          ...value,
          arguments: [PixelRatio.roundToNearestPixel(value.arguments[0])],
        },
        flatStyle,
        flatStyleMeta,
        options,
        {
          wrap: false,
        },
      );
    }
    case "rgb": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        joinArgs: false,
        callback(value: any) {
          const args = value.slice(4, -1).split(",");

          if (args.length === 4) {
            return `rgba(${args.join(",")})`;
          }
          return value;
        },
      });
    }
    default: {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options);
    }
  }
}

interface CreateRuntimeFunctionOptions {
  wrap?: boolean;
  parseFloat?: boolean;
  joinArgs?: boolean;
  callback?: Function;
  spreadCallbackArgs?: boolean;
}

/**
 * TODO: This function is overloaded with functionality
 */
function createRuntimeFunction(
  value: RuntimeValue,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
  {
    wrap = true,
    parseFloat: shouldParseFloat = true,
    joinArgs: joinArguments = true,
    spreadCallbackArgs: spreadCallbackArguments = false,
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
