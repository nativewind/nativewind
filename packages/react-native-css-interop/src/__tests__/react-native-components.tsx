import {
  View,
  Text,
  Pressable,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StatusBar,
  VirtualizedList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as JSX from "react/jsx-runtime";
import { render as tlRender, screen } from "@testing-library/react-native";

import { registerCSS, resetStyles } from "../testing-library";
import { render as renderJSX } from "../runtime/render";

const testID = "react-native-css-interop";

function render(component: React.ReactElement<any>) {
  return tlRender(
    renderJSX((JSX as any).jsx, component.type, component.props, ""),
  );
}

beforeEach(() => resetStyles());

test("Component types", () => {
  [
    <Modal className="bg-black" presentationClassName="bg-black" />,
    <Pressable className="bg-black" />,
    <StatusBar className="bg-black" />,
    <Text className="bg-black" />,
    <View className="bg-black" />,
    <ImageBackground
      source={{}}
      className="bg-black"
      imageClassName="bg-black"
    />,
    <TextInput className="bg-black" placeholderClassName="bg-black" />,
    <KeyboardAvoidingView
      className="bg-black"
      contentContainerClassName="bg-black"
    />,
    <ScrollView
      className="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
    <VirtualizedList
      data={[]}
      renderItem={() => null}
      className="bg-black"
      ListHeaderComponentClassName="bg-black"
      ListFooterComponentClassName="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
  ];
});

test("TextInput", () => {
  registerCSS(
    `.text-black { color: black } 
     .placeholder\\:text-white:native-prop() {
       -rn-placeholderTextColor: #fff
     }`,
  );

  render(
    <TextInput testID={testID} className="text-black placeholder:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      placeholderTextColor: "rgba(255, 255, 255, 1)",
      style: expect.objectContaining({
        color: "rgba(0, 0, 0, 1)",
      }),
    }),
  );
});

test("ActivityIndicator", () => {
  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<ActivityIndicator testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  // These should be removed
  expect(component.props).not.toEqual(
    expect.objectContaining({
      className: expect.any,
    }),
  );

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      color: "rgba(255, 255, 255, 1)",
      style: expect.objectContaining({
        backgroundColor: "rgba(0, 0, 0, 1)",
      }),
    }),
  );
});
