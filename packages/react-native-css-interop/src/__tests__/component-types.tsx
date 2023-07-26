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
} from "react-native";

/**
 * This file is mostly to assert that the types are working correctly
 */
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
