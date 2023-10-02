import { vars } from "nativewind";
import { Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "blue",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="text-[--theme-fg]">Try editing me! 🎉</Text>
    </View>
  );
};

export default App;
