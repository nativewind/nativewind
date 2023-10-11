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
  "createElementAndCheckCssInterop",
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
          isMemberExpression(path.node) &&
          isIdentifier(path.node.property, { name: "createElement" }) &&
          isIdentifier(path.node.object)
        ) {
          const name = path.node.object.name;

          if (
            name.toLowerCase() !== "react" ||
            !isImportedFromReact(path.scope.getBinding(name))
          ) {
            return;
          }

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
    path.isImportDeclaration() ||
    path.isImportNamespaceSpecifier()
  ) {
    return (
      isImportDeclaration(path.parentPath.node) &&
      path.parentPath.node.source.value.toLowerCase() === "react"
    );
  } else if (path.isVariableDeclarator()) {
    return (
      isCallExpression(path.node.init) &&
      isIdentifier(path.node.init.callee, { name: "require" }) &&
      isStringLiteral(path.node.init.arguments[0], { value: "react" })
    );
  } else {
    return false;
  }
}
