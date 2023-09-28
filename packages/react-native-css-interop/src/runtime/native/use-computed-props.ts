import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
  PlatformColor,
  TargetedEvent,
  TransformsStyle,
} from "react-native";

import {
  ContainerRuntime,
  ExtractedStyleValue,
  InteropMeta,
  RuntimeValue,
  Style,
  StyleMeta,
  StyleProp,
} from "../../types";
import { StyleSheet, forceRerenderSignal, getGlobalStyle } from "./stylesheet";
import {
  testContainerQuery,
  testMediaQuery,
  testPseudoClasses,
} from "./conditions";
import { isRuntimeValue } from "../../shared";
import { styleMetaMap, vh, vw } from "./misc";
import { rem } from "./rem";
import {
  ComponentContext,
  componentContext,
  createComponentContext,
} from "./proxy";
import { NormalizedOptions } from "./prop-mapping";
import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import {
  EffectStore,
  createEffectStore,
  reactGlobal,
  setupStore,
  teardownStore,
} from "../signals";
import { styleSpecificityCompareFn } from "../specificity";

export interface StyledEffectStore<P extends Record<string, unknown>>
  extends Omit<EffectStore, "getSnapshot"> {
  (): void;
  props: P;
  checkDependencies(inheritedContext: ComponentContext): void;
  context: ComponentContext;
  inheritedContext: ComponentContext;
  lastDependencies: P[string][];
  lastSnapshot: number;
  getSnapshot: () => ReturnType<typeof processStyles>;
  regenerateStyles: boolean;
  snapshot: ReturnType<typeof processStyles<P>>;
}

export function useStyledProps<P extends Record<string, unknown>>(
  props: P,
  options: NormalizedOptions<P>,
) {
  const inheritedContext = useContext(componentContext);

  // Create a single store per component
  const storeRef = useRef<StyledEffectStore<P>>();
  if (storeRef.current == null) {
    storeRef.current = createStyledEffectStore(
      options,
      inheritedContext,
      (props as any).testID,
    );
  }
  const store = storeRef.current;
  store.props = props;

  // If the context changes, or we unmount we need to cleanup the store's subscribers
  useEffect(() => () => store.cleanup(), [store.context]);

  // If a dependency has changed, mark the store as dirty
  store.checkDependencies(inheritedContext);

  // Sync with the store. If the store is dirty, it will recompute the styles
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  // If there are any delayedEffects, run them
  useEffect(() => {
    if (reactGlobal.delayedEffects.size) {
      for (const sub of reactGlobal.delayedEffects) {
        sub();
      }
      reactGlobal.delayedEffects.clear();
    }
  }, [reactGlobal.delayedEffects.size]);

  return {
    store,
    ...value,
  };
}

function createStyledEffectStore<P extends Record<string, unknown>>(
  options: NormalizedOptions<P>,
  inheritedContext: ComponentContext,
  debugName?: string,
) {
  const store: StyledEffectStore<P> = Object.assign(
    createEffectStore(debugName) as any,
    {
      regenerateStyles: true,
      lastSnapshot: 0,
      lastDependencies: [],
      snapshot: undefined,
      context: createComponentContext(inheritedContext),
      inheritedContext,
      checkDependencies(currentContext: ComponentContext) {
        let failed = reactGlobal.shouldRerender.has(store);
        reactGlobal.shouldRerender.delete(store);
        reactGlobal.delayedEffects.delete(store);

        if (store.inheritedContext !== currentContext) {
          store.inheritedContext = currentContext;
          store.context = createComponentContext(currentContext);
          failed = true;
        }

        failed ||= options.dependencies.some((k, index) => {
          return store.props[k] !== store.lastDependencies[index];
        });

        if (failed) {
          store.regenerateStyles = true;
          store.lastDependencies = options.dependencies.map(
            (k) => store.props[k],
          );
        }
      },
      getSnapshot() {
        if (!store.regenerateStyles && store.lastSnapshot === store.version) {
          return store.snapshot;
        }

        // Setup the store to be the current signal context
        setupStore(store);
        forceRerenderSignal.get();

        store.regenerateStyles = false;
        store.snapshot = processStyles<P>(store.props, store, options);
        store.lastSnapshot = store.version;

        teardownStore();

        return store.snapshot;
      },
    },
  );

  return store;
}

function processStyles<P extends Record<string, unknown>>(
  props: P,
  store: StyledEffectStore<P>,
  options: NormalizedOptions<P>,
): {
  styledProps: Record<string, StyleProp>;
  meta: InteropMeta<P>;
} {
  const styledProps: Record<string, any> = {};
  const animatedProps = new Set<keyof P>();
  const transitionProps = new Set<keyof P>();

  const context = store.context;
  const interaction = store.context.interaction;

  let hasActive: boolean | undefined = false;
  let hasHover: boolean | undefined = false;
  let hasFocus: boolean | undefined = false;
  let hasInlineContainers = false;
  let hasInlineVariables = false;
  let requiresLayout = false;
  let variables: Record<string, ExtractedStyleValue> = {};

  let dynamicStyles = false;

  for (const [key, { sources, nativeStyleToProp }] of options.config) {
    dynamicStyles ||= Boolean(nativeStyleToProp);

    const prop = props[key] as StyleProp;
    let stylesToFlatten: StyleProp = [];
    if (prop) stylesToFlatten.push(prop);

    for (const sourceProp of sources) {
      const source = props?.[sourceProp];
      if (typeof source !== "string") continue;

      StyleSheet.unstable_hook_onClassName?.(source);

      for (const className of source.split(/\s+/)) {
        let styles = getGlobalStyle(className);
        if (!styles) continue;

        if (!Array.isArray(styles)) {
          styles = [styles];
        }

        for (const style of styles) {
          stylesToFlatten.push(style);
        }
      }
    }

    dynamicStyles ||= stylesToFlatten.some((s) => s && styleMetaMap.has(s));

    stylesToFlatten = stylesToFlatten.sort(
      styleSpecificityCompareFn(dynamicStyles ? "desc" : "asc"),
    );

    if (stylesToFlatten.length === 1) {
      stylesToFlatten = stylesToFlatten[0] as StyleProp;
    }

    if (!stylesToFlatten) continue;

    if (!dynamicStyles) {
      styledProps[key] = Object.freeze(stylesToFlatten);
      continue;
    }

    const style = flattenStyle(stylesToFlatten, store);
    const meta = styleMetaMap.get(style);

    if (meta) {
      if (meta.variables) {
        hasInlineVariables = true;
        variables = { ...variables, ...meta.variables };
      }

      if (meta.container?.names) {
        hasInlineContainers = true;
        const runtime: ContainerRuntime = {
          type: "normal",
          interaction,
          style,
        };

        context.containers.__default.set(runtime);
        for (const name of meta.container.names) {
          context.containers[name].set(runtime);
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
    if (nativeStyleToProp) {
      for (const [key, targetProp] of Object.entries(nativeStyleToProp)) {
        const styleKey = key as keyof Style;
        if (targetProp === true && style[styleKey]) {
          styledProps[styleKey] = style[styleKey];
          delete style[styleKey];
        }
      }
    }

    styledProps[key] = Object.freeze(style);
  }

  if (hasInlineVariables) {
    const existingKeys = new Set(Object.keys(context.variables));
    for (const [key, value] of Object.entries(variables)) {
      existingKeys.delete(key);
      context.variables[key].set(value);
    }

    for (const key of existingKeys) {
      context.variables[key].set(undefined);
    }
  }

  let animationInteropKey: string | undefined;
  if (animatedProps.size > 0 || transitionProps.size > 0) {
    animationInteropKey = [...animatedProps, ...transitionProps].join(":");
  }

  if (requiresLayout) {
    styledProps.onLayout = (event: LayoutChangeEvent) => {
      (props as any).onLayout?.(event);
      interaction.layoutWidth.set(event.nativeEvent.layout.width);
      interaction.layoutHeight.set(event.nativeEvent.layout.height);
    };
  }

  let convertToPressable = false;
  if (hasActive) {
    convertToPressable = true;
    styledProps.onPressIn = (event: GestureResponderEvent) => {
      (props as any).onPressIn?.(event);
      interaction.active.set(true);
    };
    styledProps.onPressOut = (event: GestureResponderEvent) => {
      (props as any).onPressOut?.(event);
      interaction.active.set(false);
    };
  }
  if (hasHover) {
    convertToPressable = true;
    styledProps.onHoverIn = (event: MouseEvent) => {
      (props as any).onHoverIn?.(event);
      interaction.hover.set(true);
    };
    styledProps.onHoverOut = (event: MouseEvent) => {
      (props as any).onHoverIn?.(event);
      interaction.hover.set(false);
    };
  }
  if (hasFocus) {
    convertToPressable = true;
    styledProps.onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      (props as any).onFocus?.(event);
      context.interaction.focus.set(true);
    };
    styledProps.onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      (props as any).onBlur?.(event);
      context.interaction.focus.set(false);
    };
  }

  const meta: InteropMeta<P> = {
    interopMeta: true,
    animatedProps,
    animationInteropKey,
    convertToPressable,
    transitionProps,
    requiresLayout,
    componentContext: context,
  };

  return {
    styledProps,
    meta,
  };
}

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
export function flattenStyle<P extends Record<string, unknown>>(
  style: StyleProp,
  store: StyledEffectStore<P>,
  options: FlattenStyleOptions = {},
  flatStyle: Style = {},
  depth = 0,
): Style {
  if (!style) {
    return flatStyle;
  }

  if (Array.isArray(style)) {
    for (const s of style) {
      flattenStyle(s, store, options, flatStyle, depth + 1);
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

    if (
      !testPseudoClasses(store.context.interaction, styleMeta.pseudoClasses)
    ) {
      return flatStyle;
    }
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatStyle;
  }

  if (
    styleMeta.containerQuery &&
    !testContainerQuery(
      styleMeta.containerQuery,
      store.inheritedContext.containers,
    )
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
    for (const [key, value] of Object.entries(styleMeta.variables)) {
      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        store,
        options,
      );

      flatStyleMeta.variables ??= {};
      flatStyleMeta.variables[key] = getterOrValue;
    }
  }

  for (let [key, value] of Object.entries(style)) {
    if (
      // Items at this depth are in reverse order (due to specificityCompareFn sorting)
      // We can shortcut setting a value if it already exists
      depth <= 1 &&
      (value === undefined ||
        (key in flatStyle &&
          flatStyle[key as keyof typeof flatStyle] !== undefined))
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
              store,
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
                store,
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
          store,
          options,
        );
        extractAndDefineProperty(
          "textShadow.height",
          value[1],
          flatStyle,
          flatStyleMeta,
          store,
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
          store,
          options,
        );
        extractAndDefineProperty(
          "shadowOffset.height",
          value[1],
          flatStyle,
          flatStyleMeta,
          store,
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
          store,
          options,
        );
    }
  }

  return flatStyle;
}

function extractAndDefineProperty<P extends Record<string, unknown>>(
  key: string,
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  store: StyledEffectStore<P>,
  options: FlattenStyleOptions = {},
) {
  const getterOrValue = extractValue(
    value,
    flatStyle,
    flatStyleMeta,
    store,
    options,
  );

  if (getterOrValue === undefined) return;

  const tokens = key.split(".");
  let target = flatStyle as any;

  for (const [index, token] of tokens.entries()) {
    if (index === tokens.length - 1) {
      if (typeof getterOrValue === "function") {
        Object.defineProperty(target, token, {
          configurable: true,
          enumerable: true,
          get: getterOrValue,
          set(value) {
            target[token] = value;
          },
        });
      } else {
        target[token] = getterOrValue;
      }
    } else {
      target[token] ??= {};
      target = target[token];
    }
  }
}

function extractValue<P extends Record<string, unknown>>(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  store: StyledEffectStore<P>,
  options: FlattenStyleOptions = {},
): any {
  if (!isRuntimeValue(value)) {
    return value;
  }

  const context = store.context;

  switch (value.name) {
    case "var": {
      const name = value.arguments[0] as string;

      let cache: any;

      return () => {
        if (cache) return cache;

        const signal = store.context.variables[name];
        if (!signal) return;

        return store.runInEffect(() => {
          const resolvedValue = extractValue(
            signal.get(),
            flatStyle,
            flatStyleMeta,
            store,
            options,
          );

          cache =
            typeof resolvedValue === "function"
              ? resolvedValue()
              : resolvedValue;

          return cache;
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
      } else if (context.interaction?.layoutHeight) {
        reference = context.interaction.layoutHeight.get();
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (typeof flatStyle.height === "number") {
            reference = flatStyle.height;
          } else if (context.interaction.layoutHeight) {
            reference = context.interaction.layoutHeight.get();
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
      } else if (typeof flatStyle.width === "number") {
        reference = flatStyle.width;
      } else if (context.interaction.layoutWidth) {
        reference = context.interaction.layoutWidth.get();
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (typeof flatStyle.width === "number") {
            reference = flatStyle.width;
          } else if (context.interaction?.layoutWidth) {
            reference = context.interaction.layoutWidth.get();
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
      return createRuntimeFunction(
        value,
        flatStyle,
        flatStyleMeta,
        store,
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
        store,
        options,
        {
          wrap: false,
          parseFloat: false,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
        store,
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
}

/**
 * TODO: This function is overloaded with functionality
 */
function createRuntimeFunction<P extends Record<string, unknown>>(
  value: RuntimeValue,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  store: StyledEffectStore<P>,
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
        store,
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
