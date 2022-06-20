import {
  assignmentExpression,
  callExpression,
  Expression,
  expressionStatement,
  identifier,
  logicalExpression,
  memberExpression,
  Statement,
} from "@babel/types";
import { babelStyleSerializer } from "../../utils/serialize-styles";

export function appendVariables(
  body: Statement[],
  {
    styles,
    atRules,
    masks,
    topics,
    childClasses,
  }: ReturnType<typeof babelStyleSerializer>
) {
  body.push(
    assignGlobalThis(
      "nativewind_styles",
      callExpression(
        memberExpression(identifier("RNStyleSheet"), identifier("create")),
        [styles]
      )
    )
  );

  if (atRules) body.push(assignGlobalThis("nativewind_at_rules", atRules));
  if (topics) body.push(assignGlobalThis("nativewind_topics", topics));
  if (masks) body.push(assignGlobalThis("nativewind_masks", masks));
  if (childClasses)
    body.push(assignGlobalThis("nativewind_child_classes", childClasses));
}

function assignGlobalThis(
  name: keyof typeof globalThis,
  ...parameters: Expression[]
) {
  return expressionStatement(
    assignmentExpression(
      "=",
      memberExpression(identifier("globalThis"), identifier(name)),
      callExpression(
        memberExpression(identifier("Object"), identifier("assign")),
        [
          logicalExpression(
            "||",
            memberExpression(identifier("globalThis"), identifier(name)),
            identifier("{}")
          ),
          ...parameters,
        ]
      )
    )
  );
}
