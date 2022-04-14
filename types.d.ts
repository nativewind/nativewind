import type {
  ViewProps,
  TextProps,
  ImageProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface ViewStyle {
    $$css?: true;
    tailwindcssReactNative?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TextStyle {
    $$css?: true;
    tailwindcssReactNative?: string;
  }

  interface ImageProps {
    className?: string;
  }

  interface ImageStyle {
    $$css?: true;
    tailwindcssReactNative?: string;
  }
}
