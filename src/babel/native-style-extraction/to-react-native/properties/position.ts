import { Style } from "css-to-react-native";

const supportedValues = new Set(["absolute", "relative"]);

export function position(value: string): Style {
  if (supportedValues.has(value)) {
    return { position: value };
  }

  // This is a special edge case
  // The tailwindcss keeps picking up `static` as its a javascript keyword
  // So instead of throwing an error we just ignore it
  if (value === "static") {
    return {};
  }

  throw new Error("position");
}
