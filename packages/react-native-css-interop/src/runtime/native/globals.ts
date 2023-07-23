import { createContext } from "react";
import { ContainerRuntime } from "../../types";

export * from "../shared/globals";

//   "--tw-border-spacing-x": 0,
//   "--tw-border-spacing-y": 0,
//   "--tw-translate-x": 0,
//   "--tw-translate-y": 0,
//   "--tw-rotate": "0deg",
//   "--tw-skew-x": "0deg",
//   "--tw-skew-y": "0deg",
//   "--tw-scale-x": 1,
//   "--tw-scale-y": 1,
// });
export const ContainerContext = createContext<Record<string, ContainerRuntime>>(
  {},
);
