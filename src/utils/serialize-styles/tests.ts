import { ExtractedValues } from "../../postcss/plugin";
import { serializeHelper } from "./helper";

export function testStyleSerializer({ styles, ...rest }: ExtractedValues) {
  return {
    ...rest,
    ...serializeHelper(styles, (key, value) => {
      if (value === "styleSheet(hairlineWidth)") {
        return [key, 1];
      }

      return [key, value];
    }),
  };
}
