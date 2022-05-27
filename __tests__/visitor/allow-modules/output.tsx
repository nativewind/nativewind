import { StyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";
export function Test() {
  return (
    <TailwindProvider>
      <StyledComponent className="container" component={View}>
        <StyledComponent className="font-bold" component={Text}>
          Hello world!
        </StyledComponent>
        <MotiText className="font-bold">Not in allowModuleTransform</MotiText>
      </StyledComponent>
    </TailwindProvider>
  );
}
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  StyleSheet.create({
    container: {
      width: "100%",
    },
    "container.0": {
      maxWidth: 640,
    },
    "container.1": {
      maxWidth: 768,
    },
    "container.2": {
      maxWidth: 1024,
    },
    "container.3": {
      maxWidth: 1280,
    },
    "container.4": {
      maxWidth: 1536,
    },
    "font-bold": {
      fontWeight: "700",
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {
    container: [
      [["media", "(min-width: 640px)"]],
      [["media", "(min-width: 768px)"]],
      [["media", "(min-width: 1024px)"]],
      [["media", "(min-width: 1280px)"]],
      [["media", "(min-width: 1536px)"]],
    ],
  }
);
