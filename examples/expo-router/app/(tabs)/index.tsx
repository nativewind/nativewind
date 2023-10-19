import { vars } from "nativewind";
import { Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "blue",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="text-5xl font-bold text-[--theme-fg] transition duration-[5s]">
        Variables
      </Text>
      <Text className="text-5xl font-bold active:scale-150 active:text-red-500 transition duration-[500ms]">
        Transitions
      </Text>
      <Text className="text-5xl font-bold animate-none active:animate-bounce">
        Animations
      </Text>
    </View>
  );
};

export default App;
