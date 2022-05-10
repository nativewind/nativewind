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
  nthChild?: number;
  [ChildClassNameSymbol]?: string;
}
