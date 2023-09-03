export default function () {
  return {
    plugins: [
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
