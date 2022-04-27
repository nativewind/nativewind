import { StyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";
export function Test() {
  return (
    <TailwindProvider platform="native">
      <StyledComponent className="container" component={View}>
        <StyledComponent className="font-bold" component={Text}>
          Hello world!
        </StyledComponent>
        <MotiText className="font-bold">Do not transform</MotiText>
      </StyledComponent>
    </TailwindProvider>
  );
}
Object.assign(
  globalThis.tailwindcss_react_native_style,
  StyleSheet.create({
    container: {
      width: "100%",
    },
    container_1: {
      maxWidth: 640,
    },
    container_2: {
      maxWidth: 768,
    },
    container_3: {
      maxWidth: 1024,
    },
    container_4: {
      maxWidth: 1280,
    },
    container_5: {
      maxWidth: 1536,
    },
    "font-bold": {
      fontWeight: "700",
    },
  })
);
Object.assign(globalThis.tailwindcss_react_native_media, {
  container: [
    ["(min-width: 640px)", 1],
    ["(min-width: 768px)", 2],
    ["(min-width: 1024px)", 3],
    ["(min-width: 1280px)", 4],
    ["(min-width: 1536px)", 5],
  ],
});
