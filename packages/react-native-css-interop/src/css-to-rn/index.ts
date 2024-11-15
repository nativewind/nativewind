import { versions } from "node:process";

import { debug as debugFn } from "debug";
import {
  ContainerRule,
  Declaration,
  DeclarationBlock,
  transform as lightningcss,
  MediaQuery,
  MediaRule,
  Rule,
  SelectorList,
  TokenOrValue,
} from "lightningcss";

import {
  CompilerCollection,
  CompilerOptions,
  StyleSheetOptions,
} from "../runtime/pure/compiler/types";
import {
  StyleDeclaration,
  StyleRule,
  StyleRuleSet,
} from "../runtime/pure/types";
import {
  SpecificityIndex,
  StyleRuleSetSymbol,
  StyleRuleSymbol,
} from "../shared";
import { MoveTokenRecord, Specificity, SpecificityValue } from "../types";
import { buildAddFn } from "./add";
import { defaultFeatureFlags } from "./feature-flags";
import { normalizeSelectors, toRNProperty } from "./normalize-selectors";
import {
  AddWarningFn,
  parseDeclaration,
  ParseDeclarationOptions,
} from "./parseDeclaration";
import { extractKeyFrames } from "./reanimated";

// import { isDeepEqual } from "../util/isDeepEqual";

type CSSInteropAtRule = {
  type: "custom";
  value: {
    name: string;
    prelude: { value: { components: Array<{ value: string }> } };
  };
};

export type { CompilerOptions };

/**
 * Converts a CSS file to a collection of style declarations that can be used with the StyleSheet API
 *
 * @param {Buffer|string} code - The CSS file contents
 * @param {CssToReactNativeRuntimeOptions} options - (Optional) Options for the conversion process
 * @returns {StyleSheetRegisterOptions} - An object containing the extracted style declarations and animations
 */
export function cssToReactNativeRuntime(
  code: Buffer | string,
  options: CompilerOptions = {},
  debug = debugFn("react-native-css-interop"),
): StyleSheetOptions {
  const features = Object.assign({}, defaultFeatureFlags, options.features);

  debug(`Features ${JSON.stringify(features)}`);

  if (Number(versions.node.split(".")[0]) < 18) {
    throw new Error("react-native-css-interop only supports NodeJS >18");
  }

  // Parse the grouping options to create an array of regular expressions
  const grouping =
    options.grouping?.map((value) => {
      return typeof value === "string" ? new RegExp(value) : value;
    }) ?? [];

  debug(`Grouping ${grouping}`);

  // These will by mutated by `extractRule`
  const collection: CompilerCollection = {
    darkMode: ["media"],
    rules: new Map(),
    animations: new Map(),
    rootVariables: {},
    universalVariables: {},
    flags: {},
    appearanceOrder: 1,
    ...options,
    features,
    grouping,
    varUsageCount: new Map(),
  };

  debug(`Start lightningcss`);

  const onVarUsage = (token: TokenOrValue) => {
    if (token.type === "function") {
      token.value.arguments.forEach((token) => onVarUsage(token));
    } else if (token.type === "var") {
      const variable = token.value;
      const varName = variable.name.ident;
      collection.varUsageCount.set(
        varName,
        (collection.varUsageCount.get(varName) || 0) + 1,
      );

      if (variable.fallback) {
        const fallbackValues = variable.fallback;
        fallbackValues.forEach((varObj) => onVarUsage(varObj));
      }
    }
  };

  // Use the lightningcss library to traverse the CSS AST and extract style declarations and animations
  lightningcss({
    filename: "style.css", // This is ignored, but required
    code: typeof code === "string" ? new TextEncoder().encode(code) : code,
    visitor: {
      Declaration(decl) {
        // Track variable usage, we remove any unused variables
        if (decl.property !== "unparsed" && decl.property !== "custom") return;
        decl.value.value.forEach((varObj) => onVarUsage(varObj));
      },
      StyleSheetExit(sheet) {
        debug(`Found ${sheet.rules.length} rules to process`);

        for (const rule of sheet.rules) {
          // Extract the style declarations and animations from the current rule
          extractRule(rule, collection);
          // We have processed this rule, so now delete it from the AST
        }

        debug(`Exiting lightningcss`);
      },
    },
    customAtRules: {
      cssInterop: {
        prelude: "<custom-ident>+",
      },
      "rn-move": {
        prelude: "<custom-ident>+",
      },
    },
  });

  debug(`Found ${collection.rules.size} valid rules`);

  const ruleSets = new Map<string, StyleRuleSet>();
  for (const [name, styles] of collection.rules) {
    if (styles.length === 0) continue;

    const styleRuleSet: StyleRuleSet = { [StyleRuleSetSymbol]: true };

    for (const style of styles) {
      if (style.s[SpecificityIndex.Important]) {
        styleRuleSet.i ??= [];
        styleRuleSet.i.push(style);
      } else {
        styleRuleSet.n ??= [];
        styleRuleSet.n.push(style);
      }
    }

    ruleSets.set(name, styleRuleSet);
  }

  const stylesheetOptions: StyleSheetOptions = {};

  if (Object.keys(collection.flags).length) {
    stylesheetOptions.f = collection.flags;
  }

  if (ruleSets.size) {
    stylesheetOptions.s = Array.from(ruleSets);
  }
  if (collection.animations.size) {
    stylesheetOptions.a = Array.from(collection.animations);
  }
  if (Object.keys(collection.rootVariables).length) {
    stylesheetOptions.va = Object.entries(collection.rootVariables);
  }
  if (Object.keys(collection.universalVariables).length) {
    stylesheetOptions.vu = Object.entries(collection.universalVariables);
  }

  return stylesheetOptions;
}

/**
 * Extracts style declarations and animations from a given CSS rule, based on its type.
 *
 * @param {Rule} rule - The CSS rule to extract style declarations and animations from.
 * @param {CompilerCollection} collection - Options for the extraction process, including maps for storing extracted data.
 * @param {CssToReactNativeRuntimeOptions} parseOptions - Options for parsing the CSS code, such as grouping related rules together.
 */
function extractRule(
  rule: Rule | CSSInteropAtRule,
  collection: CompilerCollection,
  partialStyle: Partial<StyleRule> = {},
) {
  // Check the rule's type to determine which extraction function to call
  switch (rule.type) {
    case "keyframes": {
      // If the rule is a keyframe animation, extract it with the `extractKeyFrames` function
      extractKeyFrames(rule.value, collection);
      break;
    }
    case "container": {
      // If the rule is a container, extract it with the `extractedContainer` function
      extractedContainer(rule.value, collection);
      break;
    }
    case "media": {
      // If the rule is a media query, extract it with the `extractMedia` function
      extractMedia(rule.value, collection);
      break;
    }
    case "style": {
      // If the rule is a style declaration, extract it with the `getExtractedStyle` function and store it in the `declarations` map
      if (rule.value.declarations) {
        for (const style of getExtractedStyles(
          rule.value.declarations,
          collection,
          getRnMoveMapping(rule.value.rules),
        )) {
          setStyleForSelectorList(
            { ...partialStyle, ...style },
            rule.value.selectors,
            collection,
          );
        }
        collection.appearanceOrder++;
      }
      break;
    }
    case "custom": {
      if (rule.value && rule.value?.name === "cssInterop") {
        extractCSSInteropFlag(rule, collection);
      }
    }
  }
}

/**
 * @rn-move is a custom at-rule that allows you to move a style property to a different prop/location
 * Its a placeholder concept until we improve the LightningCSS parsing
 */
function getRnMoveMapping<D, M>(rules?: any[]): MoveTokenRecord {
  if (!rules) return {};
  const mapping: MoveTokenRecord = {};

  for (const rule of rules) {
    if (rule.type !== "custom" && rule.value.name !== "rn-move") continue;

    /**
     * - is a special character that indicates that the style should be hoisted
     * Otherwise, keep it on the 'style' prop
     */
    let [first, tokens] = rule.value.prelude.value.components.map(
      (c: any) => c.value,
    );

    if (tokens) {
      if (tokens.startsWith("&")) {
        mapping[toRNProperty(first)] = [
          "style",
          ...tokens.replace("&", "").split(".").map(toRNProperty),
        ];
      } else {
        mapping[toRNProperty(first)] = tokens.split(".").map(toRNProperty);
      }
    } else {
      if (first.startsWith("&")) {
        mapping["*"] = ["style", toRNProperty(first.replace("&", ""))];
      } else {
        mapping["*"] = [toRNProperty(first)];
      }
    }
  }

  return mapping;
}

function extractCSSInteropFlag(
  rule: CSSInteropAtRule,
  collection: CompilerCollection,
) {
  if (rule.value.prelude.value.components[0].value !== "set") {
    return;
  }
  const [_, name, type, ...other] = rule.value.prelude.value.components.map(
    (c) => c.value,
  );

  if (name === "darkMode") {
    let value: string | undefined;

    if (other.length === 0 || other[0] === "media") {
      collection.darkMode = ["media"];
    } else {
      value = other[0];

      if (value.startsWith(".")) {
        value = value.slice(1);
        collection.darkMode = ["class", value];
      } else if (value.startsWith("[")) {
        collection.darkMode = ["attribute", value];
      } else if (value === "dark") {
        collection.darkMode = ["class", value];
      }
    }
    collection.flags.darkMode = `${type} ${value}`.trim();
  } else {
    const value = other.length === 0 ? "true" : other;
    collection.flags[name] = value;
  }
}

/**
 * This function takes in a MediaRule object, an CompilerCollection object and a CssToReactNativeRuntimeOptions object,
 * and returns an array of MediaQuery objects representing styles extracted from screen media queries.
 *
 * @param mediaRule - The MediaRule object containing the media query and its rules.
 * @param collection - The CompilerCollection object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 *
 * @returns undefined if no screen media queries are found in the mediaRule, else it returns the extracted styles.
 */
function extractMedia(mediaRule: MediaRule, collection: CompilerCollection) {
  // Initialize an empty array to store screen media queries
  const media: MediaQuery[] = [];

  // Iterate over all media queries in the mediaRule
  for (const mediaQuery of mediaRule.query.mediaQueries) {
    if (
      // If this is only a media query
      (mediaQuery.mediaType === "print" && mediaQuery.qualifier !== "not") ||
      // If this is a @media not print {}
      // We can only do this if there are no conditions, as @media not print and (min-width: 100px) could be valid
      (mediaQuery.mediaType !== "print" &&
        mediaQuery.qualifier === "not" &&
        mediaQuery.condition === null)
    ) {
      continue;
    }

    media.push(mediaQuery);
  }

  if (media.length === 0) {
    return;
  }

  // Iterate over all rules in the mediaRule and extract their styles using the updated CompilerCollection
  for (const rule of mediaRule.rules) {
    extractRule(rule, collection, { m: media });
  }
}

/**
 * @param containerRule - The ContainerRule object containing the container query and its rules.
 * @param collection - The CompilerCollection object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 */
function extractedContainer(
  containerRule: ContainerRule,
  collection: CompilerCollection,
) {
  return;
  // Iterate over all rules inside the containerRule and extract their styles using the updated CompilerCollection
  // for (const rule of containerRule.rules) {
  //   extractRule(rule, collection, {
  //     c: [
  //       {
  //         n: containerRule.name,
  //         // condition: containerRule.condition,
  //       },
  //     ],
  //   });
  // }
}

/**
 * @param style - The ExtractedStyle object to use when setting styles.
 * @param selectorList - The SelectorList object containing the selectors to use when setting styles.
 * @param declarations - The declarations object to use when adding declarations.
 */
function setStyleForSelectorList(
  extractedStyle: StyleRule,
  selectorList: SelectorList,
  collection: CompilerCollection,
) {
  const { rules: declarations } = collection;

  for (const selector of normalizeSelectors(
    extractedStyle,
    selectorList,
    collection,
  )) {
    const style: StyleRule = { ...extractedStyle };
    if (!style.d) continue;

    if (
      selector.type === "rootVariables" || // :root
      selector.type === "universalVariables" // *
    ) {
      const fontSizeValue = style.d.findLast((value) => {
        return typeof value === "object" && "fontSize" in value;
      })?.[0];

      if (
        typeof collection.inlineRem !== "number" &&
        fontSizeValue &&
        typeof fontSizeValue === "object" &&
        "fontSize" in fontSizeValue &&
        typeof fontSizeValue["fontSize"] === "number"
      ) {
        collection.rem = fontSizeValue["fontSize"];
        if (collection.inlineRem === undefined) {
          collection.inlineRem = collection.rem;
        }
      }

      if (!style.v) {
        continue;
      }

      const { type, subtype } = selector;
      collection[type] ??= {};
      for (const [name, value] of style.v) {
        collection[type] ??= {};
        collection[type][name] ??= [name, [undefined, undefined]];
        if (subtype === "light") {
          collection[type][name][0] = value;
        } else {
          collection[type][name][1] = value;
        }

        //   collection[type][name][subtype] = value as any;
      }
      continue;
    } else if (selector.type === "className") {
      const { className, groupClassName, pseudoClasses, attrs, media } =
        selector;

      const specificity: SpecificityValue[] = [];
      for (let index = 0; index < 5; index++) {
        const value =
          (extractedStyle.s[index] ?? 0) + (selector.specificity[index] ?? 0);
        if (value) {
          specificity[index] = value;
        }
      }

      if (groupClassName) {
        // Add the conditions to the declarations object
        addDeclaration(declarations, groupClassName, {
          [StyleRuleSymbol]: true,
          s: specificity,
          ac: attrs,
          d: [],
          // c: {
          //   names: [groupClassName],
          // },
        });

        // style.c ??= [];
        // style.c.push({
        //   name: groupClassName,
        //   pseudoClasses: groupPseudoClasses,
        //   attrs: groupAttrs,
        // });
      }

      if (media) {
        style.m ??= [];
        style.m.push(...media);
      }

      const rule: StyleRule = {
        ...style,
        s: specificity,
      };

      if (pseudoClasses) rule.p = pseudoClasses;
      if (attrs) rule.ac = attrs;

      addDeclaration(declarations, className, rule);
    }
  }
}

function addDeclaration(
  declarations: CompilerCollection["rules"],
  className: string,
  style: StyleRule,
) {
  const existing = declarations.get(className);
  if (existing) {
    existing.push(style);
  } else {
    declarations.set(className, [style]);
  }
}

function getExtractedStyles(
  declarationBlock: DeclarationBlock<Declaration>,
  collection: CompilerCollection,
  mapping: MoveTokenRecord = {},
): StyleRule[] {
  const extractedStyles = [];

  const specificity: Specificity = [];
  specificity[SpecificityIndex.Order] = collection.appearanceOrder;

  if (declarationBlock.declarations && declarationBlock.declarations.length) {
    extractedStyles.push(
      declarationsToStyle(
        declarationBlock.declarations,
        collection,
        specificity,
        mapping,
      ),
    );
  }

  if (
    declarationBlock.importantDeclarations &&
    declarationBlock.importantDeclarations.length
  ) {
    specificity[SpecificityIndex.Important] = 1;
    extractedStyles.push(
      declarationsToStyle(
        declarationBlock.importantDeclarations,
        collection,
        specificity,
        mapping,
      ),
    );
  }

  return extractedStyles;
}

function declarationsToStyle(
  declarations: Declaration[],
  collection: CompilerCollection,
  specificity: Specificity,
  mapping: MoveTokenRecord,
): StyleRule {
  const styleDecls: StyleDeclaration[] = [];
  const extractedStyle: StyleRule = {
    [StyleRuleSymbol]: true,
    s: [...specificity],
    d: styleDecls,
  };

  const parseDeclarationOptions: ParseDeclarationOptions = {
    features: {},
    ...collection,
  };

  const addWarning: AddWarningFn = (type, value) => {
    // TODO
  };

  const addFn = buildAddFn(extractedStyle, collection, mapping);

  for (const declaration of declarations) {
    parseDeclaration(declaration, parseDeclarationOptions, addFn, addWarning);
  }

  return extractedStyle;
}
