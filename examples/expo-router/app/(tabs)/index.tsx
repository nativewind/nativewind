import { vars } from "nativewind";
import { Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "blue",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="text-[16px] font-bold text-[--theme-fg] transition duration-[2s]">
        Variables
      </Text>
      <Text className="text-base font-bold active:scale-150 active:text-[--theme-fg] transition duration-[500ms]">
        Transitions
      </Text>
      <Text className="text-[14px] font-bold animate-none active:animate-bounce">
        Animations
      </Text>
    </View>
  );
};

export default App;
