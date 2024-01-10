import {
  Identifier,
  MemberExpression,
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isMemberExpression,
  isStringLiteral,
} from "@babel/types";
import { Binding, NodePath } from "@babel/traverse";
import { addNamed } from "@babel/helper-module-imports";

const importMeta = [
  "createInteropElement",
  "react-native-css-interop",
] as const;

const allowedFileRegex =
  /^(?!.*[\/\\](react|react-native|react-native-web|react-native-css-interop)[\/\\]).*$/;

export default function () {
  return {
    name: "react-native-css-interop-imports",
    visitor: {
      MemberExpression(path: NodePath<MemberExpression>, state: any) {
        if (
          allowedFileRegex.test(state.filename) &&
          isIdentifier(path.node.property, { name: "createElement" })
        ) {
          let shouldReplace = false;

          if (
            isIdentifier(path.node.object, { name: "react" }) ||
            isIdentifier(path.node.object, { name: "React" })
          ) {
            shouldReplace = isImportedFromReact(
              path.scope.getBinding(path.node.object.name),
            );
          } else if (
            isMemberExpression(path.node.object) &&
            isIdentifier(path.node.object.object, { name: "_react" }) &&
            isIdentifier(path.node.object.property, { name: "default" })
          ) {
            shouldReplace = isImportedFromReact(
              path.scope.getBinding(path.node.object.object.name),
            );
          }

          if (!shouldReplace) return;

          path.replaceWith(addNamed(path, ...importMeta));
        }
      },
      Identifier(path: NodePath<Identifier>, state: any) {
        if (
          allowedFileRegex.test(state.filename) &&
          path.node.name === "createElement" &&
          path.parentPath.isCallExpression() &&
          isImportedFromReact(path.scope.getBinding("createElement"))
        ) {
          path.replaceWith(addNamed(path, ...importMeta));
        }
      },
    },
  };
}

function isImportedFromReact(binding?: Binding): boolean {
  const path = binding?.path;

  if (!path) {
    return false;
  } else if (
    path.isImportSpecifier() ||
    path.isImportDefaultSpecifier() ||
    path.isImportDeclaration() ||
    path.isImportNamespaceSpecifier()
  ) {
    return (
      isImportDeclaration(path.parentPath.node) &&
      path.parentPath.node.source.value.toLowerCase() === "react"
    );
  } else if (path.isVariableDeclarator() && isCallExpression(path.node.init)) {
    if (
      isIdentifier(path.node.init.callee, { name: "require" }) && // const <name> = require("react")
      isStringLiteral(path.node.init.arguments[0], { value: "react" })
    ) {
      return true;
    } else if (
      isIdentifier(path.node.init.callee, { name: "_interopRequireDefault" }) && // const <name> = _interopRequireDefault(require("react"))
      isCallExpression(path.node.init.arguments[0]) &&
      isIdentifier(path.node.init.arguments[0].callee, { name: "require" }) &&
      isStringLiteral(path.node.init.arguments[0].arguments[0], {
        value: "react",
      })
    ) {
      return true;
    }
  }
  return false;
}
