import { writeFileSync } from "node:fs";
import { Plugin, PluginCreator } from "postcss";
import {
  createAtRuleSelector,
  getSelectorMask,
  normalizeCssSelector,
} from "../shared/selector";
import { toReactNative } from "./to-react-native";
import { StyleRecord, Style, StyleError, AtRuleTuple } from "../types/common";
import { outputFormatter } from "./output-formatter";
import { StyleSheetRuntime } from "../style-sheet";
import { getRuntime } from "./get-runtime";

const atRuleSymbol = Symbol("media");
const isForChildrenSymbol = Symbol("children");

declare module "postcss" {
  abstract class Container {
    [atRuleSymbol]: AtRuleTuple[];
    [isForChildrenSymbol]: boolean;
  }
}

export interface ExtractedValues {
  styles: StyleRecord;
  topics: Record<string, Array<string>>;
  masks: Record<string, number>;
  units: StyleSheetRuntime["units"];
  childClasses: Record<string, string[]>;
  atRules: Record<string, Array<AtRuleTuple[]>>;
}

export interface DoneResult extends ExtractedValues {
  errors: StyleError[];
}

export interface PostcssPluginOptions {
  output?: string;
  platform?: string;
  done?: (result: DoneResult) => void;
}

export const plugin: PluginCreator<PostcssPluginOptions> = ({
  done,
  output,
  platform,
} = {}) => {
  const styles: DoneResult["styles"] = {};
  const topics: Record<string, Set<string>> = {};
  const childClasses: Record<string, string[]> = {};
  const masks: DoneResult["masks"] = {};
  const units: DoneResult["units"] = {};
  const atRules: DoneResult["atRules"] = {};
  const errors: DoneResult["errors"] = [];

  return {
    postcssPlugin: "tailwindcss-react-native-style-extractor",
    OnceExit: (root) => {
      root.walk((node) => {
        if (node.type === "atrule") {
          node[atRuleSymbol] ??= node?.parent?.[atRuleSymbol]
            ? [...node.parent[atRuleSymbol]]
            : [];

          if (node.name === "selector" && node.params.startsWith("(>")) {
            node[isForChildrenSymbol] = true;
          }

          node[atRuleSymbol].push([node.name, node.params]);
        } else if (node.type === "rule") {
          let nativeDeclarations: Style = {};

          // Get all the declarations
          node.walkDecls((decl) => {
            nativeDeclarations = {
              ...nativeDeclarations,
              ...toReactNative(decl, {
                onError: (error) => errors.push(error),
              }),
            };
          });

          if (Object.keys(nativeDeclarations).length === 0) {
            return;
          }

          for (const s of node.selectors) {
            const mask = getSelectorMask(s, s.includes('[dir="rtl"]'));
            const rules = node.parent?.[atRuleSymbol];

            const {
              declarations,
              units: selectorUnits,
              topics: selectorTopics,
            } = getRuntime(s, nativeDeclarations, rules);

            let selector = normalizeCssSelector(s);

            if (mask > 0) {
              masks[selector] ??= 0;
              masks[selector] |= mask;
            }

            if (node.parent?.[isForChildrenSymbol]) {
              const childSelector = `${selector}.children`;
              childClasses[selector] ??= [];
              childClasses[selector].push(childSelector);
              selector = childSelector;
            }

            if (selectorTopics) {
              topics[selector] ??= new Set();
              for (const topic of selectorTopics) {
                topics[selector].add(topic);
              }
            }

            if (rules) {
              atRules[selector] ??= [];
              atRules[selector].push(rules);
              selector = createAtRuleSelector(
                selector,
                atRules[selector].length - 1
              );
            }

            if (selectorUnits) {
              units[selector] = selectorUnits;
            }

            styles[selector] = declarations;
          }
        }
      });

      const arrayTopics: DoneResult["topics"] = {};

      for (const [key, value] of Object.entries(topics)) {
        arrayTopics[key] = [...value.values()];
      }

      if (done)
        done({
          styles,
          masks,
          atRules,
          childClasses,
          topics: arrayTopics,
          units,
          errors,
        });

      if (output) {
        writeFileSync(
          output,
          outputFormatter(
            {
              styles,
              masks,
              atRules,
              childClasses,
              units,
              topics: arrayTopics,
            },
            platform
          )
        );
      }
    },
  } as Plugin;
};

plugin.postcss = true;

export default plugin;
