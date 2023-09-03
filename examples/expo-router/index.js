import ReactNativeFeatureFlags from "react-native/Libraries/ReactNative/ReactNativeFeatureFlags";

// enable the JS-side of the w3c PointerEvent implementation
ReactNativeFeatureFlags.shouldEmitW3CPointerEvents = () => true;

// enable hover events in Pressibility to be backed by the PointerEvent implementation.
// shouldEmitW3CPointerEvents should also be true
ReactNativeFeatureFlags.shouldPressibilityUseW3CPointerEventsForHover = () =>
  true;

import "expo-router/entry";
