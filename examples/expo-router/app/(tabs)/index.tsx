import { vars } from "nativewind";
import { Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "green",
});

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text testID="test" className="web:text-green-500 ios:text-blue-500">
        Variables!!!!!!
      </Text>
    </View>
  );
};

export default App;

// <View className="flex-1 items-center justify-center" style={theme}>
//   <Text className="font-bold text-blue-100">Variables!</Text>
// </View>

// <Text className="font-bold active:scale-150 active:text-[--theme-fg] transition">
//   Transitions
// </Text>
// <Text className="font-bold text-blue-500 animate-bounce">Animations</Text>
