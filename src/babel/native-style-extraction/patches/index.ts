import { aspectRatio } from "./aspect-ratio";
import { display } from "./display";
import { overflow } from "./overflow";
import { position } from "./position";

function noAuto(value: number | string) {
  if (value === "auto") {
    return null;
  }

  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postProcessingCss: Record<string, (value: any) => any> = {
  aspectRatio,
  display,
  overflow,
  position,
  top: noAuto,
  flexBasis: noAuto,
  bottom: noAuto,
  left: noAuto,
  right: noAuto,
  marginTop: noAuto,
  marginRight: noAuto,
  marginBottom: noAuto,
  marginLeft: noAuto,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const preProcessingCss: Record<string, (value: any) => any> = {
  zIndex: noAuto,
};
