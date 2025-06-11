import { addNamespace } from "@babel/helper-module-imports";
import { Binding, NodePath } from "@babel/traverse";
import {
  Identifier,
  identifier,
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isMemberExpression,
  isStringLiteral,
  MemberExpression,
  memberExpression,
  Program,
} from "@babel/types";

const importFunction = "createInteropElement";
const importModule = "react-native-css-interop";
const importAs = "ReactNativeCSSInterop";

const allowedFileRegex =
  /^(?!.*[\/\\](react|react-native|react-native-web|react-native-css-interop)[\/\\]).*$/;

export default function () {
  return {
    name: "react-native-css-interop-imports",
    visitor: {
      Program(path: NodePath<Program>, state: { filename: string }) {
        if (allowedFileRegex.test(state.filename)) {
          let newExpression: null | MemberExpression = null;
          const insertImportStatement = () => {
            if (newExpression === null) {
              const importAsIdentifier = addNamespace(path, importModule, {
                nameHint: importAs,
              });
              newExpression = memberExpression(
                importAsIdentifier,
                identifier(importFunction),
              );
            }
            return newExpression;
          };
          path.traverse(visitor, { ...state, insertImportStatement });
        }
      },
    },
  };
}

const visitor = {
  MemberExpression(
    path: NodePath<MemberExpression>,
    state: { insertImportStatement: () => MemberExpression; filename: string },
  ) {
    if (isIdentifier(path.node.property, { name: "createElement" })) {
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

      const newExpression = state.insertImportStatement();

      path.replaceWith(newExpression);
    }
  },
  Identifier(
    path: NodePath<Identifier>,
    state: { insertImportStatement: () => MemberExpression; filename: string },
  ) {
    if (
      path.node.name === "createElement" &&
      path.parentPath.isCallExpression() &&
      isImportedFromReact(path.scope.getBinding("createElement"))
    ) {
      const newExpression = state.insertImportStatement();
      path.replaceWith(newExpression);
    }
  },
};

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
