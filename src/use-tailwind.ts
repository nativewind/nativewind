import { StyleProp } from "react-native";
import { AtRuleRecord } from "./types/common";
import type { ChildClassNameSymbol } from "./with-styled-props";

export { useTailwind } from "./use-tailwind.web";

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};

export type UseTailwindCallback<P> = (className?: string) => StyleProp<P> & {
  [ChildClassNameSymbol]?: AtRuleRecord[];
};

export type UseTailwindCallbackFlattern<P> = (className?: string) => P & {
  [ChildClassNameSymbol]?: AtRuleRecord[];
};

export interface UseTailwindOptions {
  flatten?: boolean;
  nthChild?: number;
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  [ChildClassNameSymbol]?: string;
}
