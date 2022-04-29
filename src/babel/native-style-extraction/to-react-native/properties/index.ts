import { Style } from "css-to-react-native";
import { StyleProperty } from "../is-invalid-property";
import { aspectRatio } from "./aspect-ratio";
import { flex } from "./flex";
import { only } from "./only";
import { position } from "./position";

export const properties: Partial<
  Record<StyleProperty, (value: string, name: string) => Style>
> = {
  aspectRatio,
  alignContent: only("alignContent", [
    "flex-start",
    "flex-end",
    "stretch",
    "center",
    "space-between",
    "space-around",
  ]),
  display: only("display", ["none", "flex"]),
  flex,
  overflow: only("overflow", ["visible", "hidden", "scroll"]),
  position,
  flexBasis: only("flexBasis", { units: ["%"] }),
  top: only("top", { units: ["px", "%"] }),
  bottom: only("bottom", { units: ["px", "%"] }),
  left: only("left", { units: ["px", "%"] }),
  right: only("right", { units: ["px", "%"] }),
  margin: only("margin", { units: ["px", "%"] }),
  marginBottom: only("marginBottom", { units: ["px", "%"] }),
  marginLeft: only("marginLeft", { units: ["px", "%"] }),
  marginRight: only("marginRight", { units: ["px", "%"] }),
  marginTop: only("marginTop", { units: ["px", "%"] }),
  width: only("width", {
    units: ["px", "%"],
  }),
  zIndex: only("zIndex", { number: true }),
};
