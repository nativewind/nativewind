import {
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  objectExpression,
  ObjectProperty,
  objectProperty,
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
  const objectProperties: ObjectProperty[] = [
    objectProperty(identifier("styles"), styles),
  ];

  if (atRules) {
    objectProperties.push(objectProperty(identifier("atRules"), atRules));
  }

  if (masks) {
    objectProperties.push(objectProperty(identifier("masks"), masks));
  }

  if (topics) {
    objectProperties.push(objectProperty(identifier("topics"), topics));
  }

  if (childClasses) {
    objectProperties.push(
      objectProperty(identifier("childClasses"), childClasses)
    );
  }

  body.push(
    expressionStatement(
      callExpression(
        memberExpression(
          identifier("NativeWindStyleSheet"),
          identifier("create")
        ),
        [objectExpression(objectProperties)]
      )
    )
  );
}
