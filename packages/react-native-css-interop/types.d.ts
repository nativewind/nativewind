import "react-native";

declare module "react-native" {
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    className?: string;
  }

  interface ImagePropsBase {
    className?: string;
  }

  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface SwitchProps {
    className?: string;
  }

  interface InputAccessoryViewProps {
    className?: string;
  }

  interface TouchableWithoutFeedbackProps {
    className?: string;
  }
}
