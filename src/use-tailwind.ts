import { StyleProp } from "react-native";
import { ChildClassNameSymbol } from "./utils/child-styles";

export { useTailwind } from "./use-tailwind.web";

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};

export type UseTailwindCallback<P> = (className?: string) => StyleProp<P> &
  P & {
    [ChildClassNameSymbol]?: string;
  };

export interface UseTailwindOptions {
  flatten?: boolean;
  nthChild?: number;
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  [ChildClassNameSymbol]?: string;
}
