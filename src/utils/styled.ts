import { ComponentType, PropsWithChildren } from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

export type Component<P> = ComponentType<P>;

export type InferStyle<T> = T extends { style?: StyleProp<infer S> }
  ? S & (ViewStyle | TextStyle | ImageStyle)
  : never;

export type StyledProps<P, T = InferStyle<P>> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<T | RWNCssStyle>;
  }
>;

export type StyledPropsWithKeys<P, K extends keyof P> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<InferStyle<P> | RWNCssStyle>;
  } & { [key in K]: P[key] | string }
>;

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};
