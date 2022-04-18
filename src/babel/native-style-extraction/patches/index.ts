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

export const postProcessingCssFn: Record<string, (value: any) => any> = {
  aspectRatio,
  display,
  overflow,
  position,
  top: noAuto,
  flexBasis: noAuto,
  bottom: noAuto,
  left: noAuto,
  right: noAuto,
};

export const preProcessingCssFn: Record<string, (value: any) => any> = {
  zIndex: noAuto,
};
