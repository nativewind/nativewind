import { Text, TextProps } from "react-native";

export function TestComponent(props: TextProps & { className?: string }) {
  return <Text {...props}>Hello world!</Text>;
}
