import { Text } from "react-native";

interface ShouldNotBeTransformedProps {
  className: string;
}

export function ShouldNotBeTransformed(_props: ShouldNotBeTransformedProps) {
  return <Text>Hello world!</Text>;
}
