import { Text } from "react-native";

interface ShouldNotBeTransformedProps {
  className: string;
}

export function ShouldNotBeTransformed({
  className,
  ...props
}: ShouldNotBeTransformedProps) {
  return <Text {...props}>Hello world!</Text>;
}
