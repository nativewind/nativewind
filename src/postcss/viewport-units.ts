import { PluginCreator } from "postcss";

const finderRegex = /(-?.+)(vw|vh)\b/;

const processed = Symbol("processed");

declare module "postcss" {
  interface Rule {
    [processed]: boolean;
  }

  interface Declaration {
    [processed]: boolean;
  }

  interface Container {
    [processed]: boolean;
  }

  interface AtRule {
    [processed]: boolean;
  }
}

const plugin: PluginCreator<never> = () => {
  return {
    postcssPlugin: "tailwindcss-react-native-viewport-units",
    Rule(rule, { AtRule }) {
      if (rule[processed]) return;

      rule.walkDecls((decl) => {
        const matches = decl.value.match(finderRegex);

        if (matches) {
          const dynamicStyle = new AtRule({
            name: "dynamic-style",
            nodes: [
              {
                selector: rule.selector,
                nodes: [
                  {
                    prop: decl.prop,
                    value: `${matches[2]}(${matches[1]})`,
                  },
                ],
              },
            ],
          });

          dynamicStyle[processed] = true;
          rule.replaceWith(dynamicStyle);
        }
      });
    },
  };
};

plugin.postcss = true;

export default plugin;
