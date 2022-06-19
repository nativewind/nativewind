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

export function appendVariables(
  body: Statement[],
  {
    styles,
    atRules,
    masks,
    topics,
  }: {
    styles: Expression;
    atRules?: Expression;
    masks?: Expression;
    topics?: Expression;
  }
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
