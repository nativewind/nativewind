import { ComponentType, PropsWithChildren } from "react";
import { StyleProp } from "react-native";

export type Component<
  P extends { style?: StyleProp<T> | undefined },
  T
> = ComponentType<P & { style?: StyleProp<T> }>;

export type StyledProps<P, T> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<T | RWNCssStyle>;
  }
>;

export type StyledPropsWithKeys<P, T, K extends keyof P> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<T | RWNCssStyle>;
  } & { [key in K]: P[key] | string }
>;

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};
