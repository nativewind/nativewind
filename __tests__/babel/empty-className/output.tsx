import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
export function Test() {
  return (
    <TailwindProvider>
      <StyledComponent className="" component={Text}>
        Hello world!
      </StyledComponent>
    </TailwindProvider>
  );
}
