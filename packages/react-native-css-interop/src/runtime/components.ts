"use client";

import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
  VirtualizedList,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";

import { cssInterop, remapProps } from "./api";

cssInterop(Image, { className: "style" });
cssInterop(Pressable, { className: "style" });
cssInterop(SafeAreaView, { className: "style" });
cssInterop(Switch, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(TouchableHighlight, { className: "style" });
cssInterop(TouchableOpacity, { className: "style" });
cssInterop(TouchableWithoutFeedback, { className: "style" });
cssInterop(View, { className: "style" });
cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
cssInterop(StatusBar, {
  className: { target: false, nativeStyleToProp: { backgroundColor: true } },
});
cssInterop(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});

remapProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
remapProps(ImageBackground, {
  className: "style",
  imageClassName: "imageStyle",
});
remapProps(KeyboardAvoidingView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
remapProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
