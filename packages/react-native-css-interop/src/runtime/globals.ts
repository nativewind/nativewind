import { InteropFunction } from "../types";

export const defaultInteropRef = {
  current: (() => [""]) as InteropFunction,
};
