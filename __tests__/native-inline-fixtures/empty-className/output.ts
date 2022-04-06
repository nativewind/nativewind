import { StyleSheet } from "react-native";
import { __useParseTailwind } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "../../../src";
export function Test() {
  return (
    <TailwindProvider>
      <Text
        style={__useParseTailwind("", {
          styles: __tailwindStyles,
          media: __tailwindMedia,
        })}
      >
        Hello world!
      </Text>
    </TailwindProvider>
  );
}

const __tailwindStyles = StyleSheet.create({});

const __tailwindMedia = {};
