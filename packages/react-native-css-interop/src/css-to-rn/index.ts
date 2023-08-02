import {
  KeyframesRule,
  Animation,
  Declaration,
  transform as lightningcss,
  DeclarationBlock,
  MediaQuery,
  MediaRule,
  SelectorList,
  Rule,
  ContainerType,
  ContainerRule,
} from "lightningcss";

import { exhaustiveCheck, isRuntimeValue } from "../shared";
import {
  ExtractedStyle,
  StyleSheetRegisterOptions,
  AnimatableCSSProperty,
  ExtractedAnimation,
  ExtractionWarning,
  ExtractRuleOptions,
} from "../types";
import { ParseDeclarationOptions, parseDeclaration } from "./parseDeclaration";
import { normalizeSelectors } from "./normalize-selectors";

export type CssToReactNativeRuntimeOptions = {
  inlineRem?: number | false;
  darkMode?: false | string;
  grouping?: (string | RegExp)[];
  ignorePropertyWarningRegex?: (string | RegExp)[];
  platform?: string;
};

type CSSInteropAtRule = {
  type: "custom";
  value: {
    name: string;
    prelude: { value: { components: Array<{ value: string }> } };
  };
};

/**
 * Converts a CSS file to a collection of style declarations that can be used with the StyleSheet API
 *
 * @param {Buffer|string} code - The CSS file contents
 * @param {CssToReactNativeRuntimeOptions} options - (Optional) Options for the conversion process
 * @returns {StyleSheetRegisterOptions} - An object containing the extracted style declarations and animations
 */
export function cssToReactNativeRuntime(
  code: Buffer | string,
  options: CssToReactNativeRuntimeOptions = { platform: "native" },
): StyleSheetRegisterOptions {
  code = typeof code === "string" ? code : code.toString("utf-8");
  // I don't know why we need to remove this line, but we do
  // Issue: https://github.com/parcel-bundler/lightningcss/issues/484
  code = code.replaceAll("-webkit-text-size-adjust: 100%;", "");
  code = Buffer.from(code);

  // Parse the grouping options to create an array of regular expressions
  const grouping =
    options.grouping?.map((value) => {
      return typeof value === "string" ? new RegExp(value) : value;
    }) ?? [];

  // These will by mutated by `extractRule`
  const extractOptions: ExtractRuleOptions = {
    ...options,
    darkMode: { type: "media" },
    grouping,
    declarations: new Map(),
    keyframes: new Map(),
    rootVariables: {},
    rootDarkVariables: {},
    defaultVariables: {},
    defaultDarkVariables: {},
  };

  // Use the lightningcss library to traverse the CSS AST and extract style declarations and animations
  lightningcss({
    filename: "style.css", // This is ignored, but required
    code,
    visitor: {
      Rule(rule) {
        // Extract the style declarations and animations from the current rule
        extractRule(rule, extractOptions, options);
        // We have processed this rule, so now delete it from the AST
        return [];
      },
    },
    customAtRules: {
      cssInterop: {
        prelude: "<custom-ident>+",
      },
    },
  });

  // Convert the extracted style declarations and animations from maps to objects and return them
  return {
    declarations: Object.fromEntries(extractOptions.declarations),
    keyframes: Object.fromEntries(extractOptions.keyframes),
    rootVariables: extractOptions.rootVariables,
    rootDarkVariables: extractOptions.rootDarkVariables,
    defaultVariables: extractOptions.defaultVariables,
    defaultDarkVariables: extractOptions.defaultDarkVariables,
    darkMode: extractOptions.darkMode,
  };
}

/**
 * Extracts style declarations and animations from a given CSS rule, based on its type.
 *
 * @param {Rule} rule - The CSS rule to extract style declarations and animations from.
 * @param {ExtractRuleOptions} extractOptions - Options for the extraction process, including maps for storing extracted data.
 * @param {CssToReactNativeRuntimeOptions} parseOptions - Options for parsing the CSS code, such as grouping related rules together.
 */
function extractRule(
  rule: Rule | CSSInteropAtRule,
  extractOptions: ExtractRuleOptions,
  parseOptions: CssToReactNativeRuntimeOptions,
  partialStyle: Partial<ExtractedStyle> = {},
) {
  // Check the rule's type to determine which extraction function to call
  switch (rule.type) {
    case "keyframes": {
      // If the rule is a keyframe animation, extract it with the `extractKeyFrames` function
      extractKeyFrames(rule.value, extractOptions, parseOptions);
      break;
    }
    case "container": {
      // If the rule is a container, extract it with the `extractedContainer` function
      extractedContainer(rule.value, extractOptions, parseOptions);
      break;
    }
    case "media": {
      // If the rule is a media query, extract it with the `extractMedia` function
      extractMedia(rule.value, extractOptions, parseOptions);
      break;
    }
    case "style": {
      // If the rule is a style declaration, extract it with the `getExtractedStyle` function and store it in the `declarations` map
      if (rule.value.declarations) {
        setStyleForSelectorList(
          {
            ...partialStyle,
            ...getExtractedStyle(rule.value.declarations, parseOptions),
          },
          rule.value.selectors,
          extractOptions,
        );
      }
      break;
    }
    case "custom": {
      if (rule.value?.name !== "cssInterop") {
        break;
      }
      const tokens = rule.value.prelude.value.components.map((c) => c.value);
      extractRuleOptions(tokens, extractOptions);
    }
  }
}

function extractRuleOptions(
  tokens: string[],
  extractOptions: ExtractRuleOptions,
) {
  const [option, ...rest] = tokens;

  switch (option) {
    case "darkMode": {
      if (rest[0] === "media") {
        extractOptions.darkMode = { type: "media" };
      } else if (rest[0] === "class") {
        extractOptions.darkMode = { type: "class", value: rest[1] ?? "dark" };
      } else if (rest[0] === "attribute" && rest[1]) {
        extractOptions.darkMode = { type: "attribute", value: rest[1] };
      }
    }
  }
}

/**
 * This function takes in a MediaRule object, an ExtractRuleOptions object and a CssToReactNativeRuntimeOptions object,
 * and returns an array of MediaQuery objects representing styles extracted from screen media queries.
 *
 * @param mediaRule - The MediaRule object containing the media query and its rules.
 * @param extractOptions - The ExtractRuleOptions object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 *
 * @returns undefined if no screen media queries are found in the mediaRule, else it returns the extracted styles.
 */
function extractMedia(
  mediaRule: MediaRule,
  extractOptions: ExtractRuleOptions,
  parseOptions: CssToReactNativeRuntimeOptions,
) {
  // Initialize an empty array to store screen media queries
  const media: MediaQuery[] = [];

  // Iterate over all media queries in the mediaRule
  for (const mediaQuery of mediaRule.query.mediaQueries) {
    // Check if the media type is screen
    let isScreen = mediaQuery.mediaType !== "print";
    if (mediaQuery.qualifier === "not") {
      isScreen = !isScreen;
    }

    // If it's a screen media query, add it to the media array
    if (isScreen) {
      media.push(mediaQuery);
    }
  }

  if (media.length === 0) {
    return;
  }

  // Iterate over all rules in the mediaRule and extract their styles using the updated ExtractRuleOptions
  for (const rule of mediaRule.rules) {
    extractRule(rule, extractOptions, parseOptions, { media });
  }
}

/**
 * @param containerRule - The ContainerRule object containing the container query and its rules.
 * @param extractOptions - The ExtractRuleOptions object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 */
function extractedContainer(
  containerRule: ContainerRule,
  extractOptions: ExtractRuleOptions,
  parseOptions: CssToReactNativeRuntimeOptions,
) {
  // Iterate over all rules inside the containerRule and extract their styles using the updated ExtractRuleOptions
  for (const rule of containerRule.rules) {
    extractRule(rule, extractOptions, parseOptions, {
      containerQuery: [
        {
          name: containerRule.name,
          condition: containerRule.condition,
        },
      ],
    });
  }
}

/**
 * @param style - The ExtractedStyle object to use when setting styles.
 * @param selectorList - The SelectorList object containing the selectors to use when setting styles.
 * @param declarations - The declarations object to use when adding declarations.
 */
function setStyleForSelectorList(
  extractedStyle: ExtractedStyle,
  selectorList: SelectorList,
  options: ExtractRuleOptions,
) {
  const { declarations } = options;

  for (const selector of normalizeSelectors(selectorList, options)) {
    const style = { ...extractedStyle };

    if (selector.type === "variables") {
      if (!style.variables) {
        continue;
      }

      let key;
      if (selector.darkMode) {
        key = selector.rootVariables
          ? "rootDarkVariables"
          : "defaultDarkVariables";
      } else {
        key = selector.rootVariables ? "rootVariables" : "defaultVariables";
      }

      // normalizeSelectorList will remove invalid dark mode selectors when using className
      // But if we are using type media, then we need to check the media of the styles
      if (
        style.media &&
        (!options.darkMode || options.darkMode?.type === "media")
      ) {
        // You can only have 1 media condition
        if (style.media.length !== 1) {
          continue;
        }

        const media = style.media[0];
        const condition = media.condition;
        const isDarkMode = Boolean(
          media.qualifier !== "not" &&
            condition &&
            condition.type === "feature" &&
            condition.value.type === "plain" &&
            condition.value.name === "prefers-color-scheme" &&
            condition.value.value.type === "ident" &&
            condition.value.value.value === "dark",
        );

        if (isDarkMode) {
          key =
            key === "rootVariables"
              ? "rootDarkVariables"
              : "defaultDarkVariables";
        }
      }

      Object.assign<ExtractRuleOptions, Partial<ExtractRuleOptions>>(options, {
        [key]: style.variables,
      });

      continue;
    }

    const {
      className,
      groupClassName,
      pseudoClasses,
      groupPseudoClasses,
      darkMode,
    } = selector;

    if (groupClassName) {
      // Add the conditions to the declarations object
      addDeclaration(
        groupClassName,
        {
          style: {},
          container: {
            names: [groupClassName],
          },
        },
        declarations,
      );

      style.containerQuery ??= [];
      style.containerQuery.push({
        name: groupClassName,
        pseudoClasses: groupPseudoClasses,
      });
    }

    if (darkMode) {
      style.media ??= [];
      style.media.push({
        mediaType: "all",
        condition: {
          type: "feature",
          value: {
            type: "plain",
            name: "prefers-color-scheme",
            value: { type: "ident", value: "dark" },
          },
        },
      });
    }

    // Add the className selector and its pseudo-classes to the declarations object, with the extracted style and container queries
    addDeclaration(className, { ...style, pseudoClasses }, declarations);
  }
}

function addDeclaration(
  className: string,
  style: ExtractedStyle,
  declarations: ExtractRuleOptions["declarations"],
) {
  const existing = declarations.get(className);

  if (Array.isArray(existing)) {
    existing.push(style);
  } else if (existing) {
    declarations.set(className, [existing, style]);
  } else {
    declarations.set(className, style);
  }
}

function extractKeyFrames(
  keyframes: KeyframesRule<Declaration>,
  extractOptions: ExtractRuleOptions,
  options: CssToReactNativeRuntimeOptions,
) {
  const extractedAnimation: ExtractedAnimation = { frames: [] };
  const frames = extractedAnimation.frames;

  for (const frame of keyframes.keyframes) {
    const { style } = getExtractedStyle(frame.declarations, {
      ...options,
      requiresLayout() {
        extractedAnimation.requiresLayout = true;
      },
    });

    for (const selector of frame.selectors) {
      const keyframe =
        selector.type === "percentage"
          ? selector.value * 100
          : selector.type === "from"
          ? 0
          : selector.type === "to"
          ? 100
          : undefined;

      if (keyframe === undefined) continue;

      switch (selector.type) {
        case "percentage":
          frames.push({ selector: selector.value, style });
          break;
        case "from":
          frames.push({ selector: 0, style });
          break;
        case "to":
          frames.push({ selector: 1, style });
          break;
        default:
          exhaustiveCheck(selector);
      }
    }
  }

  // Ensure there are always two frames, a start and end
  if (frames.length === 1) {
    frames.push({ selector: 0, style: {} });
  }

  extractedAnimation.frames = frames.sort((a, b) => a.selector - b.selector);

  extractOptions.keyframes.set(keyframes.name.value, extractedAnimation);
}

interface GetExtractedStyleOptions extends CssToReactNativeRuntimeOptions {
  requiresLayout?: () => void;
}

function getExtractedStyle(
  declarationBlock: DeclarationBlock<Declaration>,
  options: GetExtractedStyleOptions,
): ExtractedStyle {
  const extractedStyle: ExtractedStyle = {
    style: {},
  };

  const declarationArray = [
    declarationBlock.declarations,
    declarationBlock.importantDeclarations,
  ]
    .flat()
    .filter((d): d is Declaration => !!d);

  /*
   * Adds a style property to the rule record.
   *
   * The shorthand option handles if the style came from a long or short hand property
   * E.g. `margin` is a shorthand property for `margin-top`, `margin-bottom`, `margin-left` and `margin-right`
   *
   * The `append` option allows the same property to be added multiple times
   * E.g. `transform` accepts an array of transforms
   */
  function addStyleProp(
    property: string,
    value: any,
    { shortHand = false, append = false } = {},
  ) {
    if (value === undefined) {
      return;
    }

    if (property.startsWith("--")) {
      return addVariable(property, value);
    }

    property = kebabToCamelCase(property);

    const style = extractedStyle.style;

    if (append) {
      const styleValue = style[property];
      if (Array.isArray(styleValue)) {
        styleValue.push(...value);
      } else {
        style[property] = [value];
      }
    } else if (shortHand) {
      // If the shorthand property has already been set, don't overwrite it
      // The longhand property always have priority
      style[property] ??= value;
    } else {
      style[property] = value;
    }

    if (isRuntimeValue(value)) {
      extractedStyle.isDynamic = true;
    }
  }

  function addShortHandStyleProp(
    property: string,
    value: any,
    { append = false } = {},
  ) {
    return addStyleProp(property, value, { shortHand: true, append });
  }

  function addVariable(property: string, value: any) {
    extractedStyle.variables ??= {};
    extractedStyle.variables[property] = value;
  }

  function addContainerProp(
    declaration: Extract<
      Declaration,
      { property: "container" | "container-name" | "container-type" }
    >,
  ) {
    let names: false | string[] = ["__default"];
    let type: ContainerType | undefined;

    switch (declaration.property) {
      case "container":
        if (declaration.value.name.type === "none") {
          names = false;
        } else {
          names = declaration.value.name.value;
        }
        type = declaration.value.containerType;
        break;
      case "container-name":
        if (declaration.value.type === "none") {
          names = false;
        } else {
          names = declaration.value.value;
        }
        break;
      case "container-type":
        type = declaration.value;
        break;
    }

    extractedStyle.container ??= {};

    if (names === false) {
      extractedStyle.container.names = false;
    } else if (Array.isArray(extractedStyle.container.names)) {
      extractedStyle.container.names = [
        ...new Set([...extractedStyle.container.names, ...names]),
      ];
    } else {
      extractedStyle.container.names = names;
    }

    if (type) {
      extractedStyle.container ??= {};
      extractedStyle.container.type = type;
    }
  }

  function addTransitionProp(
    declaration: Extract<
      Declaration,
      {
        property:
          | "transition-property"
          | "transition-duration"
          | "transition-delay"
          | "transition-timing-function"
          | "transition";
      }
    >,
  ) {
    extractedStyle.transition ??= {};

    switch (declaration.property) {
      case "transition-property":
        extractedStyle.transition.property = declaration.value.map((v) => {
          return kebabToCamelCase(v.property) as AnimatableCSSProperty;
        });
        break;
      case "transition-duration":
        extractedStyle.transition.duration = declaration.value;
        break;
      case "transition-delay":
        extractedStyle.transition.delay = declaration.value;
        break;
      case "transition-timing-function":
        extractedStyle.transition.timingFunction = declaration.value;
        break;
      case "transition": {
        let setProperty = true;
        let setDuration = true;
        let setDelay = true;
        let setTiming = true;

        // Shorthand properties cannot override the longhand property
        // So we skip setting the property if it already exists
        // Otherwise, we need to set the property to an empty array
        if (extractedStyle.transition.property) {
          setProperty = false;
        } else {
          extractedStyle.transition.property = [];
        }
        if (extractedStyle.transition.duration) {
          setDuration = false;
        } else {
          extractedStyle.transition.duration = [];
        }
        if (extractedStyle.transition.delay) {
          setDelay = false;
        } else {
          extractedStyle.transition.delay = [];
        }
        if (extractedStyle.transition.timingFunction) {
          setTiming = false;
        } else {
          extractedStyle.transition.timingFunction = [];
        }

        // Loop through each transition value and only set the properties that
        // were not already set by the longhand property
        for (const value of declaration.value) {
          if (setProperty) {
            extractedStyle.transition.property?.push(
              kebabToCamelCase(
                value.property.property,
              ) as AnimatableCSSProperty,
            );
          }
          if (setDuration) {
            extractedStyle.transition.duration?.push(value.duration);
          }
          if (setDelay) {
            extractedStyle.transition.delay?.push(value.delay);
          }
          if (setTiming) {
            extractedStyle.transition.timingFunction?.push(
              value.timingFunction,
            );
          }
        }
        break;
      }
    }
  }

  function addAnimationProp(property: string, value: any) {
    if (property === "animation") {
      const groupedProperties: Record<string, any[]> = {};

      for (const animation of value as Animation[]) {
        for (const [key, value] of Object.entries(animation)) {
          groupedProperties[key] ??= [];
          groupedProperties[key].push(value);
        }
      }

      extractedStyle.animations ??= {};
      for (const [property, value] of Object.entries(groupedProperties)) {
        const key = property
          .replace("animation-", "")
          .replace(/-./g, (x) => x[1].toUpperCase()) as keyof Animation;

        extractedStyle.animations[key] ??= value;
      }
    } else {
      const key = property
        .replace("animation-", "")
        .replace(/-./g, (x) => x[1].toUpperCase()) as keyof Animation;

      extractedStyle.animations ??= {};
      extractedStyle.animations[key] = value;
    }
  }

  function addWarning(warning: ExtractionWarning): undefined {
    const warningRegexArray = options.ignorePropertyWarningRegex;

    if (warningRegexArray) {
      const match = warningRegexArray.some((regex) =>
        new RegExp(regex).test(warning.property),
      );

      if (match) return;
    }

    extractedStyle.warnings ??= [];
    extractedStyle.warnings.push(warning);
  }

  function requiresLayout() {
    extractedStyle.requiresLayout = true;
  }

  const parseDeclarationOptions: ParseDeclarationOptions = {
    addStyleProp,
    addShortHandStyleProp,
    addAnimationProp,
    addContainerProp,
    addTransitionProp,
    requiresLayout,
    addWarning,
    ...options,
  };

  for (const declaration of declarationArray) {
    parseDeclaration(declaration, parseDeclarationOptions);
  }

  return extractedStyle;
}

function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
