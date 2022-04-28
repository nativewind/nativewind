import { Plugin, PluginCreator } from "postcss";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { normaliseSelector } from "../../shared/selector";
import {
  MediaRecord,
  StyleRecord,
  Style,
  StyleError,
} from "../../types/common";
import { toReactNative } from "./to-react-native";

const mediaStringSymbol = Symbol("media_string");

declare module "postcss" {
  abstract class Container {
    [mediaStringSymbol]: string;
  }
}

export type PostcssPluginDone = (options: {
  styles: StyleRecord;
  media: MediaRecord;
  errors: StyleError[];
}) => void;

export interface PostcssPluginOptions extends Partial<TailwindConfig> {
  done?: PostcssPluginDone;
}

export const plugin: PluginCreator<PostcssPluginOptions> = ({
  done = () => {
    return;
  },
  important,
} = {}): Plugin => {
  const styles: StyleRecord = {};
  const media: MediaRecord = {};
  const errors: StyleError[] = [];

  return {
    postcssPlugin: "react-native-css-hook",
    Root: (root) => {
      root.walk((node) => {
        if (node.type === "atrule" && node.name === "media") {
          // For each media AtRule, calculate the full media query based upon its parent
          // This is because media queries can be nested
          if (node.parent?.[mediaStringSymbol]) {
            // postcssCssvariables can cause duplicate media queries so we just remove them
            node[mediaStringSymbol] =
              node.parent[mediaStringSymbol] === node.params
                ? node.params
                : `${node.parent[mediaStringSymbol]} and ${node.params}`;
          } else {
            node[mediaStringSymbol] = node.params;
          }
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

          if (node.parent?.[mediaStringSymbol]) {
            // The parent has a media query, so this needs to be added a media style
            for (const s of node.selectors) {
              const selector = normaliseSelector(s, { important });

              media[selector] ??= [];
              styles[`${selector}_${media[selector].length}`] = declarations;
              media[selector].push(node.parent[mediaStringSymbol]);
            }
          } else {
            // The parent is the root, so we are not in a media query
            for (const s of node.selectors) {
              const selector = normaliseSelector(s);
              styles[selector] = { ...styles[selector], ...declarations };
            }
          }
        }
      });

      done({ styles, media, errors });
    },
  };
};

plugin.postcss = true;

export default plugin;
