import { writeFileSync } from "node:fs";
import { Plugin, PluginCreator } from "postcss";
import { normalizeSelector } from "../shared/selector";
import { toReactNative } from "./to-react-native";
import { StyleRecord, Style, StyleError, AtRuleTuple } from "../types/common";
import { outputFormatter } from "./output-formatter";

const atRuleSymbol = Symbol("media");

declare module "postcss" {
  abstract class Container {
    [atRuleSymbol]: AtRuleTuple[];
  }
}

export interface PostcssPluginOptions {
  important?: boolean | string;
  output?: string;
  platform?: string;
  done?: (options: { styles: StyleRecord; errors: StyleError[] }) => void;
}

export const plugin: PluginCreator<PostcssPluginOptions> = ({
  done,
  output,
  platform,
  important,
} = {}) => {
  const styles: StyleRecord = {};
  const errors: StyleError[] = [];

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
            const selector = normalizeSelector(s, { important });

            styles[selector] ??= [];

            if (node.parent?.[atRuleSymbol]) {
              styles[selector].push({
                atRules: node.parent[atRuleSymbol],
                ...declarations,
              });
            } else {
              styles[selector].push(declarations);
            }
          }
        }
      });

      if (done) done({ styles, errors });

      if (output) {
        writeFileSync(output, outputFormatter(styles, platform));
      }
    },
  } as Plugin;
};

plugin.postcss = true;

export default plugin;
