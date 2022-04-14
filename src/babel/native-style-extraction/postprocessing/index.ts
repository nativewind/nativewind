import { aspectRatio } from "./aspect-ratio";
import { display } from "./display";
import { overflow } from "./overflow";
import { position } from "./position";

export const postProcessingCssFn: Record<string, (value: any) => any> = {
  aspectRatio,
  display,
  overflow,
  position,
};
