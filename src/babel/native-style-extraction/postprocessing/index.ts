import { aspectRatio } from "./aspect-ratio";
import { bottom } from "./bottom";
import { display } from "./display";
import { left } from "./left";
import { overflow } from "./overflow";
import { position } from "./position";
import { right } from "./right";
import { top } from "./top";

export const postProcessingCssFn: Record<string, (value: any) => any> = {
  aspectRatio,
  display,
  overflow,
  position,
  top,
  bottom,
  left,
  right,
};
