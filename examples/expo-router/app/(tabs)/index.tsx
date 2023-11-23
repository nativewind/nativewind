import { vars } from "nativewind";
import { Pressable, Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "red",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Pressable className="ripple-purple-500 ripple-borderless bg-black">
        <Text>Press Me</Text>
      </Pressable>
    </View>
  );
};

export default App;
