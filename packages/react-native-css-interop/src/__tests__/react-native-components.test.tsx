/** @jsxImportSource test */
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  VirtualizedList,
} from "react-native";

import { registerCSS, render, screen, setupAllComponents } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

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
     .placeholder\\:text-white {
       @rn-move color placeholderTextColor;
       color: #fff
     }`,
  );

  render(
    <TextInput testID={testID} className="text-black placeholder:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      placeholderTextColor: "#ffffff",
      style: {
        color: "#000000",
      },
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
  expect(component.props).not.toEqual({
    className: expect.any,
  });

  // ActivityIndicator will not render a backgroundColor
  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      color: "#ffffff",
      style: {
        backgroundColor: "#000000",
      },
    }),
  );
});

test(`ScrollView`, () => {
  registerCSS(`
    .bg-black { background-color: black } 
    .gap-10 { gap: 10 }
    .pt-20 {
      padding-top: 5rem
    }
    `);

  render(
    <ScrollView
      testID={testID}
      className="bg-black"
      contentContainerClassName="gap-10  pt-20"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toStrictEqual({
    testID,
    children: expect.any(Array),
    contentContainerStyle: {
      columnGap: 10,
      rowGap: 10,
      paddingTop: 70,
    },
    style: {
      backgroundColor: "#000000",
    },
  });
});
