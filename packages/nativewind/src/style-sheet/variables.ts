import context from "./context";

export function setVariables(
  properties: Record<`--${string}`, string | number>
) {
  context.setTopics(properties);

  if (typeof document !== "undefined") {
    for (const [key, value] of Object.entries(properties)) {
      document.documentElement.style.setProperty(key, value.toString());
    }
  }
}

export function recomputeWebVariables() {
  if (typeof document !== "undefined") {
    const style = getComputedStyle(document.documentElement);
    // eslint-disable-next-line unicorn/prefer-spread
    const variableKeys = Array.from(style).filter((key) =>
      key.startsWith("--")
    );

    const documentVariables = Object.fromEntries(
      variableKeys.map((key) => {
        return [key, style.getPropertyValue(key)];
      })
    );

    context.setTopics(documentVariables);
  }
}
