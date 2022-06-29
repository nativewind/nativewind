import { ExtractedValues } from "../../postcss/plugin";
import { serializeHelper } from "./helper";

export function testStyleSerializer({ styles, ...rest }: ExtractedValues) {
  return {
    ...rest,
    ...serializeHelper(styles, (key, value) => [key, value]),
  };
}
