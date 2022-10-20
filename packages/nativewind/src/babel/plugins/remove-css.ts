import { PluginPass, Visitor } from "@babel/core";

/**
 * This plugin simply removes .css imports from your code
 * If your wondering how they get processed, NativeWind sneakily
 * does this in metro.config.js
 */
export function removeCSS() {
  const visitor: Visitor<PluginPass> = {
    ImportDeclaration(path) {
      if (path.node.source.value.endsWith(".css")) {
        path.remove();
      }
    },
    CallExpression(path) {
      const callee = path.get("callee");
      if (!callee.isIdentifier() || !callee.equals("name", "require")) {
        return;
      }

      const argument = path.get("arguments")[0];
      if (!argument || !argument.isStringLiteral()) {
        return;
      }

      if (argument.node.value.endsWith(".css")) {
        path.remove();
      }
    },
  };

  return { visitor };
}
