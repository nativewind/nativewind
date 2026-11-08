jest.mock(
  "react-native-worklets",
  () => jest.requireActual("react-native-worklets/src/mock"),
  { virtual: true },
);

require("react-native-reanimated").setUpTests();
