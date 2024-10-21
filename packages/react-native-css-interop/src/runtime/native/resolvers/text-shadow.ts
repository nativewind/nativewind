import { shorthandHandler } from "./shorthand";

const width = [["textShadowOffset", "width"], "number"] as const;
const height = [["textShadowOffset", "height"], "number"] as const;
const blur = ["textShadowRadius", "number", "textShadowRadius"] as const;
const color = ["textShadowColor", "color", "color"] as const;

export const textShadow = shorthandHandler(
  [
    [width, height, blur, color],
    [color, width, height, blur],
    [width, height, color],
    [color, width, height],
    [width, height],
  ],
  [blur, color],
);
