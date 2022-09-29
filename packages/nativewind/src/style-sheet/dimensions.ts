import { Dimensions, EmitterSubscription } from "react-native";
import context from "./context";

let dimensionsListener: EmitterSubscription | undefined;

export function setDimensions(dimensions: Dimensions) {
  dimensionsListener?.remove();

  const window = dimensions.get("window");
  context.setTopics({
    "--window-width": window.width,
    "--window-height": window.height,
    "--window-orientation":
      window.width > window.height ? "landscape" : "portrait",
  });

  dimensionsListener = dimensions.addEventListener("change", ({ window }) => {
    context.setTopics({
      "--window-width": window.width,
      "--window-height": window.height,
      "--window-orientation":
        window.width > window.height ? "landscape" : "portrait",
    });
  });
}
