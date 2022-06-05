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
  { styles, media }: { styles: Expression; media: Expression }
) {
  body.push(
    expressionStatement(
      assignmentExpression(
        "=",
        memberExpression(
          identifier("globalThis"),
          identifier("tailwindcss_react_native_style")
        ),
        callExpression(
          memberExpression(identifier("Object"), identifier("assign")),
          [
            logicalExpression(
              "||",
              memberExpression(
                identifier("globalThis"),
                identifier("tailwindcss_react_native_style")
              ),
              identifier("{}")
            ),
            callExpression(
              memberExpression(
                identifier("RNStyleSheet"),
                identifier("create")
              ),
              [styles]
            ),
          ]
        )
      )
    ),
    expressionStatement(
      assignmentExpression(
        "=",
        memberExpression(
          identifier("globalThis"),
          identifier("tailwindcss_react_native_media")
        ),
        callExpression(
          memberExpression(identifier("Object"), identifier("assign")),
          [
            logicalExpression(
              "||",
              memberExpression(
                identifier("globalThis"),
                identifier("tailwindcss_react_native_media")
              ),
              identifier("{}")
            ),
            media,
          ]
        )
      )
    )
  );
}
