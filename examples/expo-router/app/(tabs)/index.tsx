import { vars } from "nativewind";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const theme = vars({
  "--theme-fg": "red",
});

const App = () => {
  const [width, setWidth] = useState("w-[100px]");
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Pressable
        className={`transition-[width] ${width} bg-red-500 h-[200px]`}
        onPress={() =>
          setWidth((prev) => (prev === "w-[100px]" ? "w-[200px]" : "w-[100px]"))
        }
      />
    </View>
  );
  // return (
  //   <View className="flex-1 items-center justify-center" style={theme}>
  //     <Text className="font-bold text-[--theme-fg]">Variables!</Text>
  //     <Text className="font-bold active:scale-150 active:text-[--theme-fg] transition duration-[500ms]">
  //       Transitions
  //     </Text>
  //     <Text className="font-bold animate-bounce">Animations</Text>
  //   </View>
  // );
};

export default App;
