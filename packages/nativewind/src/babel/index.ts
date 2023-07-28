export default function () {
  return {
    plugins: [
      "react-native-reanimated/plugin",
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "nativewind",
        },
      ],
    ],
  };
}
