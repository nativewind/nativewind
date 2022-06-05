import { StyleRecord } from "../../types/common";
import { serializeStyles } from "./serialize-styles";

export function testStyleSerializer(styleRecord: StyleRecord) {
  return serializeStyles(styleRecord, (key, value) => {
    if (value === "styleSheet(hairlineWidth)") {
      return [key, 1];
    }

    return [key, value];
  });
}
