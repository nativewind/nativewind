import { Style } from "css-to-react-native";
import { PropertyFunction } from "./only";

const supportedValues = new Set(["absolute", "relative"]);

export const position: PropertyFunction<"position"> = (value) => {
  if (supportedValues.has(value)) {
    return { position: value };
  }

  // This is a special edge case
  // The tailwindcss keeps picking up `static` as its a javascript keyword
  // So instead of throwing an error we just ignore it
  if (value === "static") {
    return {} as Style;
  }

  throw new Error("position");
};
position.prop = "position";
