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
} from "react-native";
import * as JSX from "react/jsx-runtime";
import { render as tlRender, screen } from "@testing-library/react-native";

import { registerCSS, resetStyles } from "../testing-library";
import { render as renderJSX } from "../runtime/render";
import { OpaqueStyleToken } from "../runtime/native/globals";

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
    <StatusBar barClassName="bg-black" />,
    <Text className="bg-black" />,
    <View className="bg-black" />,
    <ImageBackground
      source={{}}
      className="bg-black"
      imageClassName="bg-black"
    />,
    <KeyboardAvoidingView
      className="bg-black"
      contentContainerClassName="bg-black"
    />,
    <ScrollView
      className="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
    <FlatList
      data={[]}
      renderItem={() => null}
      className="bg-black"
      ListHeaderComponentClassName="bg-black"
      ListFooterComponentClassName="bg-black"
      columnWrapperClassName="bg-black"
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

test.skip("ActivityIndicator", () => {
  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<ActivityIndicator testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  screen.debug();

  // These should be removed
  expect(component.props).not.toEqual(
    expect.objectContaining({
      className: expect.any,
    }),
  );

  expect(component.props).toEqual({});
  // expect.objectContaining({
  //   style: new OpaqueStyleToken(),
  //   ListFooterComponentStyle: [
  //     new OpaqueStyleToken(),
  //     new OpaqueStyleToken(),
  //   ],
  //   ListHeaderComponentStyle: [
  //     new OpaqueStyleToken(),
  //     new OpaqueStyleToken(),
  //   ],
  //   contentContainerStyle: new OpaqueStyleToken(),
  //   indicatorStyle: new OpaqueStyleToken(),
  // }),
  // );
});

test("FlatList", () => {
  registerCSS(`
    .bg-black { background-color: black }
    .text-white { color: white }
    `);

  render(
    <FlatList
      testID={testID}
      data={[1]}
      numColumns={2}
      renderItem={() => <View />}
      className="bg-black"
      ListHeaderComponentClassName="bg-black text-white"
      ListFooterComponentClassName="bg-black text-white"
      columnWrapperClassName="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
  );

  const flatList = screen.getByTestId(testID);

  // These should be removed
  expect(flatList.props).not.toEqual(
    expect.objectContaining({
      className: expect.any,
      ListHeaderComponentClassName: expect.any,
      ListFooterComponentClassName: expect.any,
      columnWrapperClassName: expect.any,
      contentContainerClassName: expect.any,
      indicatorClassName: expect.any,
    }),
  );

  // These should be added
  expect(flatList.props).toEqual(
    expect.objectContaining({
      style: new OpaqueStyleToken(),
      ListFooterComponentStyle: [
        new OpaqueStyleToken(),
        new OpaqueStyleToken(),
      ],
      ListHeaderComponentStyle: [
        new OpaqueStyleToken(),
        new OpaqueStyleToken(),
      ],
      contentContainerStyle: new OpaqueStyleToken(),
      indicatorStyle: new OpaqueStyleToken(),
    }),
  );

  const columnWrapper = screen.UNSAFE_getByProps({ style: null }).props
    .children[0];

  expect(columnWrapper).toHaveStyle([
    { flexDirection: "row" },
    new OpaqueStyleToken(),
  ]);
});
