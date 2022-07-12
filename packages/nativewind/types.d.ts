import type { ViewProps, TextProps, ImageProps } from "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
    rw?: string;
  }

  interface TextProps {
    className?: string;
    tw?: string;
  }

  interface ImageProps {
    className?: string;
    tw?: string;
  }

  interface TouchableWithoutFeedbackProps {
    className?: string;
    tw?: string;
  }
}
