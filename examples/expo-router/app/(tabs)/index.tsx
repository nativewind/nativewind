import { Text, View } from "react-native";

import { vars } from "nativewind";

const theme = vars({
  "--theme-fg": "green",
});

const App = () => {
  return (
    <View className="flex-1 justify-center items-center gap-10" style={theme}>
      <Text className="text-[--theme-fg]">Variables!!!</Text>
      <Text
        suppressHighlighting
        className="active:scale-150 text-red-500 active:text-[--theme-fg] transition"
      >
        Transitions
      </Text>
      <Text className="animate-bounce">Animations!!!</Text>
    </View>
  );
};

export default App;
