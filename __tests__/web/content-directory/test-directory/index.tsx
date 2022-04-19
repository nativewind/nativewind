import { Text, TextProps } from "react-native";

export function TestComponent(props: TextProps) {
  return <Text {...props}>Hello world!</Text>;
}
