import { InjectStylesOptions } from "./compiler/types";
import { styleFamily } from "./globals";
import { Effect } from "./utils/observable";

export function injectData(options: InjectStylesOptions) {
  const batch = new Set<Effect>();

  if (options.s) {
    for (const style of options.s) {
      styleFamily(style[0]).batch(batch, style[1]);
    }
  }

  // Run all the queued effects
  for (const effect of batch) {
    effect.run();
  }
}

export function resetData() {
  styleFamily.clear();
}
