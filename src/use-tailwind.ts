import { StyleProp } from "react-native";

export { useTailwind } from "./use-tailwind.web";

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};

export type UseTailwindCallback<P> = (className?: string) => StyleProp<P> & P;

export interface UseTailwindOptions {
  siblingClassName?: string;
}
