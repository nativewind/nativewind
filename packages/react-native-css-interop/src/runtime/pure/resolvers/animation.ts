import { shorthandHandler } from "./shorthand";

const name = ["n", "string", "none"] as const;
const delay = ["de", "number", 0] as const;
const duration = ["du", "number", 0] as const;
const fill = ["f", ["none", "forwards", "backwards", "both"], "none"] as const;
const iteration = ["i", "number", 1] as const;
const playState = ["p", ["running", "paused"], "running"] as const;
const direction = [
  "di",
  ["normal", "reverse", "alternate", "alternate-reverse"],
  "normal",
] as const;
const easing = [
  "e",
  ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
  "ease",
] as const;

export const animationShorthand = shorthandHandler(
  [
    [name],
    [duration, name],
    [name, duration],
    [duration, delay, name],
    [duration, delay, iteration, name],
    [duration, delay, iteration, easing, name],
    [name, duration, easing, delay, iteration, fill],
  ],
  [name, delay, direction, duration, fill, iteration, playState, easing],
);
