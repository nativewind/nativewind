import type { EasingFunction, Time } from "lightningcss";

import type { ReanimatedMutable } from "../animations";

export type TransitionDeclarations = {
  transition?: TransitionAttributes;
  sharedValues?: Map<string, ReanimatedMutable<any>>;
};

export type TransitionStyles = {
  transitions?: Map<string | string[], ReanimatedMutable<any>>;
};

export type TransitionAttributes = {
  /**
   * The delay before the transition starts in milliseconds.
   */
  d?: number[];
  /**
   * The duration of the transition in milliseconds.
   */
  l?: number[];
  /**
   * The property to transition.
   */
  p?: string[];
  /**
   * The easing function for the transition.
   */
  t?: EasingFunction[];
};
