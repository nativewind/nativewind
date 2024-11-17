"use client";

import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { styled } from "./pure/api";

styled(Image, { className: "style" });
styled(Pressable, { className: "style" });
styled(SafeAreaView, { className: "style" });
styled(Switch, { className: "style" });
styled(Text, { className: "style" });
styled(TouchableHighlight, { className: "style" });
styled(TouchableOpacity, { className: "style" });
styled(TouchableWithoutFeedback, { className: "style" });
styled(View, { className: "style" });
styled(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
styled(StatusBar, {
  className: { target: false, nativeStyleToProp: { backgroundColor: true } },
});
styled(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
styled(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});

// remapProps(FlatList, {
//   className: "style",
//   ListFooterComponentClassName: "ListFooterComponentStyle",
//   ListHeaderComponentClassName: "ListHeaderComponentStyle",
//   columnWrapperClassName: "columnWrapperStyle",
//   contentContainerClassName: "contentContainerStyle",
// });
// remapProps(ImageBackground, {
//   className: "style",
//   imageClassName: "imageStyle",
// });
// remapProps(KeyboardAvoidingView, {
//   className: "style",
//   contentContainerClassName: "contentContainerStyle",
// });
// remapProps(VirtualizedList, {
//   className: "style",
//   ListFooterComponentClassName: "ListFooterComponentStyle",
//   ListHeaderComponentClassName: "ListHeaderComponentStyle",
//   contentContainerClassName: "contentContainerStyle",
// });

try {
  const SafeAreaView = require("react-native-safe-area-context").SafeAreaView;
  styled(SafeAreaView, {
    className: "style",
  });
} catch {}
