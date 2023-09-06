import { Text, View } from "react-native";

/**
 * Theme variables are set in the root _layout
 */
const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-[--theme-bg]">
      <Text className="text-2xl text-[--theme-fg]">Try editing me! 🎉</Text>
    </View>
  );
};

export default App;
