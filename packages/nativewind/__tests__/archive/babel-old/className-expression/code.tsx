import { Text } from "react-native";

export function Test({ isBold, isUnderline }) {
  const classNames = [];

  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");

  return <Text className={classNames.join(" ")}>Hello world!</Text>;
}
