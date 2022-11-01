import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View className="container">
      <Text className="font-bold">Hello world!</Text>
    </View>
  );
}
_NativeWindStyleSheet.create({
  styles: {
    container: {
      width: "100%",
    },
    "container@0": {
      maxWidth: 640,
    },
    "container@1": {
      maxWidth: 768,
    },
    "container@2": {
      maxWidth: 1024,
    },
    "container@3": {
      maxWidth: 1280,
    },
    "container@4": {
      maxWidth: 1536,
    },
    "font-bold": {
      fontWeight: "700",
    },
  },
  atRules: {
    container: [
      [["media", "(min-width: 640px)"]],
      [["media", "(min-width: 768px)"]],
      [["media", "(min-width: 1024px)"]],
      [["media", "(min-width: 1280px)"]],
      [["media", "(min-width: 1536px)"]],
    ],
  },
  topics: {
    container: ["width"],
  },
});
