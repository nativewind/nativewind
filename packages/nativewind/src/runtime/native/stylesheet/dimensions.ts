import { Dimensions, EmitterSubscription } from "react-native";
import { vh, vw, orientation } from "../../common";
import { setVariables } from "./runtime";

let dimensionsListener: EmitterSubscription | undefined;

export function setDimensions(dimensions: Dimensions) {
  dimensionsListener?.remove();

  const window = dimensions.get("window");
  setVariables({
    [vw]: window.width,
    [vh]: window.height,
    [orientation]: window.width > window.height ? "landscape" : "portrait",
  });

  dimensionsListener = dimensions.addEventListener("change", ({ window }) => {
    setVariables({
      [vw]: window.width,
      [vh]: window.height,
      [orientation]: window.width > window.height ? "landscape" : "portrait",
    });
  });
}

setDimensions(Dimensions);
