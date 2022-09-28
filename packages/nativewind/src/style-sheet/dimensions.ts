import { Dimensions, EmitterSubscription } from "react-native";
import context from "./context";

let dimensionsListener: EmitterSubscription | undefined;

export function setDimensions(dimensions: Dimensions) {
  dimensionsListener?.remove();

  const window = dimensions.get("window");
  context.setTopics({
    "device-width": window.width,
    "device-height": window.height,
    "device-orientation":
      window.width > window.height ? "landscape" : "portrait",
  });

  dimensionsListener = dimensions.addEventListener("change", ({ window }) => {
    context.setTopics({
      "device-width": window.width,
      "device-height": window.height,
      "device-orientation":
        window.width > window.height ? "landscape" : "portrait",
    });
  });
}
