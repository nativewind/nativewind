# Known Expo 57 dependency limitation

With Expo 57.0.21, React Native 0.86.3, Reanimated 4.5.1, and Worklets 0.10.1, cancelling a CSS animation on Android can leave the component at its last animated transform. A spinning view can remain tilted after switching to `animationName: "none"` or removing the animation styles. In Nativewind, this affects changing `animate-spin` to `animate-none`.

The failure reproduces with a direct Reanimated `Animated.View` without Nativewind or react-native-css. It is tracked in [Reanimated #10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). The confirmed environment is an Android API 34 emulator with Fabric, Hermes, and a Release build. The integrated physical iPhone cancellation case passed. Later Reanimated versions and physical Android have not been verified.

The planned RC retains Expo's exact dependency versions and discloses this limitation. Neither library includes the experimental Reanimated patch. Applications relying on CSS animation cancellation must account for this known behavior. No production workaround is currently verified by this release effort.

The issue includes a [standalone reproduction](https://gist.github.com/danstepanov/03d34ece59f03628deb77a028e8a9a03). When an official fix becomes available in the supported Expo environment, rerun the cancellation and motion checks before removing this notice. This notice does not claim that the RC has been published or that the rest of its release gate is complete.
