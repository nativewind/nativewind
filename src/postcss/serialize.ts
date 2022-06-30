import {
  arrayExpression,
  booleanLiteral,
  callExpression,
  Expression,
  identifier,
  isExpression,
  memberExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  ObjectProperty,
  objectProperty,
  stringLiteral,
  unaryExpression,
} from "@babel/types";
import {
  isRuntimeFunction,
  matchRuntimeFunction,
} from "../style-sheet/style-functions";
import { ExtractedValues } from "./plugin";

export function serializer({
  styles: rawStyles,
  atRules,
  masks,
  units,
  topics,
  childClasses,
}: ExtractedValues) {
  const serializedStyles: Record<string, Record<string, unknown>> = {};

  for (const [key, style] of Object.entries(rawStyles)) {
    serializedStyles[key] = {};

    for (const [k, v] of Object.entries(style)) {
      if (isRuntimeFunction(v)) {
        serializedStyles[key][k] = functionReplacer(v);
      } else {
        serializedStyles[key][k] = v;
      }
    }
  }

  const styles = babelSerializeLiteral(serializedStyles);

  const objectProperties: ObjectProperty[] = [
    objectProperty(identifier("styles"), styles),
  ];

  const raw: Partial<ExtractedValues> = {
    styles: rawStyles,
  };

  if (Object.keys(atRules).length > 0) {
    raw.atRules = atRules;
    objectProperties.push(
      objectProperty(identifier("atRules"), babelSerializeLiteral(atRules))
    );
  }

  if (Object.keys(masks).length > 0) {
    raw.masks = masks;
    objectProperties.push(
      objectProperty(identifier("masks"), babelSerializeLiteral(masks))
    );
  }

  if (Object.keys(topics).length > 0) {
    raw.topics = topics;
    objectProperties.push(
      objectProperty(identifier("topics"), babelSerializeLiteral(topics))
    );
  }

  if (Object.keys(units).length > 0) {
    raw.units = units;
    objectProperties.push(
      objectProperty(identifier("units"), babelSerializeLiteral(units))
    );
  }

  if (Object.keys(childClasses).length > 0) {
    raw.childClasses = childClasses;
    objectProperties.push(
      objectProperty(
        identifier("childClasses"),
        babelSerializeLiteral(childClasses)
      )
    );
  }

  return {
    raw,
    hasStyles: Object.keys(rawStyles).length > 0,
    stylesheetCreateExpression: callExpression(
      memberExpression(
        identifier("NativeWindStyleSheet"),
        identifier("create")
      ),
      [objectExpression(objectProperties)]
    ),
  };
}

function functionReplacer(functionString: string): Expression {
  const [name, value] = matchRuntimeFunction(functionString);

  if (!name) {
    return identifier("undefined");
  }

  return callExpression(
    memberExpression(identifier("NativeWindStyleSheet"), identifier("parse")),
    [
      stringLiteral(name),
      isRuntimeFunction(value)
        ? functionReplacer(value)
        : babelSerializeLiteral(value),
    ]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function babelSerializeLiteral(literal: any): Expression {
  if (isExpression(literal)) {
    return literal;
  }

  if (literal === null) {
    return nullLiteral();
  }

  switch (typeof literal) {
    case "number":
      return numericLiteral(literal);
    case "string":
      return stringLiteral(literal);
    case "boolean":
      return booleanLiteral(literal);
    case "undefined":
      return unaryExpression("void", numericLiteral(0), true);
    default:
      if (Array.isArray(literal)) {
        return arrayExpression(literal.map((n) => babelSerializeLiteral(n)));
      }

      if (isObject(literal)) {
        return objectExpression(
          Object.keys(literal)
            .filter((k) => {
              return typeof literal[k] !== "undefined";
            })
            .map((k) => {
              return objectProperty(
                stringLiteral(k),
                babelSerializeLiteral(literal[k])
              );
            })
        );
      }

      throw new Error("un-serializable literal");
  }
}

function isObject(literal: unknown): literal is Record<string, unknown> {
  return typeof literal === "object";
}
