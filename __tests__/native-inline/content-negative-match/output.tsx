import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">
        This file is not matched inside the tailwind.config.js
      </Text>
    </TailwindProvider>
  );
}
