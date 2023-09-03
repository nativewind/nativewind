import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";

const textColors = [
  "text-black",
  "text-red-500",
  "text-green-500",
  "text-blue-500",
];

export default function Page() {
  let [isPartyTime, setParty] = useState(false);
  let [textColor, setTextColor] = useState(0);

  useEffect(() => {
    if (isPartyTime) {
      const textInterval = setInterval(
        () => setTextColor((color) => ++color % textColors.length),
        1000,
      );
      return () => clearInterval(textInterval);
    } else {
      setTextColor(0);
    }
  }, [isPartyTime]);

  let textClassNames = `text-6xl font-bold transition-colors ${textColors[textColor]}`;
  let buttonClassNames =
    "rounded-md bg-indigo-500 mt-6 self-start flex-column flex-shrink";

  if (isPartyTime) {
    textClassNames += ` animate-bounce animate-spin`;
    buttonClassNames += ` animate-spin`;
  }

  return (
    <View className="p-4 flex-1 items-center">
      <View className="flex-1 max-w-4xl justify-center">
        <Text className={textClassNames}>Hello, Expo!</Text>
        <Pressable
          className={buttonClassNames}
          onPress={() => setParty(!isPartyTime)}
        >
          <Text className="text-white p-4">
            {isPartyTime ? "Stop the party 🛑" : "Start the party 🎉"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
