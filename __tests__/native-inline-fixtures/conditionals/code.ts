import { Text } from "react-native";
import { TailwindProvider } from "../../../src";

export function Test({ isBold, isUnderline }) {
  const classNames = [];

  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");

  return (
    <TailwindProvider>
      <Text className={classNames.join(" ")}>Hello world!</Text>
    </TailwindProvider>
  );
}
