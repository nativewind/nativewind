import { writeFileSync } from "node:fs";
import { Plugin, PluginCreator } from "postcss";
import {
  createAtRuleSelector,
  getSelectorMask,
  getSelectorTopics,
  normalizeCssSelector,
} from "../shared/selector";
import { toReactNative } from "./to-react-native";
import { StyleRecord, Style, StyleError, AtRuleTuple } from "../types/common";
import { outputFormatter } from "./output-formatter";

const atRuleSymbol = Symbol("media");

declare module "postcss" {
  abstract class Container {
    [atRuleSymbol]: AtRuleTuple[];
  }
}

export interface ExtractedValues {
  styles: StyleRecord;
  topics: Record<string, Array<string>>;
  masks: Record<string, number>;
  atRules: Record<string, Array<AtRuleTuple[]>>;
}

export interface DoneResult extends ExtractedValues {
  errors: StyleError[];
}

export interface PostcssPluginOptions {
  important?: boolean | string;
  output?: string;
  platform?: string;
  done?: (result: DoneResult) => void;
}

export const plugin: PluginCreator<PostcssPluginOptions> = ({
  done,
  output,
  platform,
  important,
} = {}) => {
  const styles: DoneResult["styles"] = {};
  const topics: Record<string, Set<string>> = {};
  const masks: DoneResult["masks"] = {};
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

          node[atRuleSymbol].push([node.name, node.params]);
        } else if (node.type === "rule") {
          let declarations: Style = {};

          // Get all the declarations
          node.walkDecls((decl) => {
            declarations = {
              ...declarations,
              ...toReactNative(decl, {
                onError: (error) => errors.push(error),
              }),
            };
          });

          if (Object.keys(declarations).length === 0) {
            return;
          }

          for (const s of node.selectors) {
            const mask = getSelectorMask(s);
            const rules = node.parent?.[atRuleSymbol];
            const selectorTopics = getSelectorTopics(s, declarations, rules);
            let selector = normalizeCssSelector(s, { important });

            if (selectorTopics.length > 0) {
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

            styles[selector] = declarations;

            if (mask > 0) {
              masks[selector] = masks[selector] ? masks[selector] | mask : mask;
            }
          }
        }
      });

      const arrayTopics: DoneResult["topics"] = {};

      for (const [key, value] of Object.entries(topics)) {
        arrayTopics[key] = [...value.values()];
      }

      if (done) done({ styles, masks, atRules, topics: arrayTopics, errors });

      if (output) {
        writeFileSync(
          output,
          outputFormatter(
            { styles, masks, atRules, topics: arrayTopics },
            platform
          )
        );
      }
    },
  } as Plugin;
};

plugin.postcss = true;

export default plugin;
