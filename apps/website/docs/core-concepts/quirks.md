# Quirks

NativeWind aligns CSS and React Native into a common language. However the two style engines do have their differences. We refer to these differences as quirks.

## Explicit styles

React Native has various issues when conditionally applying styles. To prevent these issues it's best to declare all styles.

For example, instead of only applying a text color for dark mode, provide both a light and dark mode text color. This is especially important for transitions and animations.

## dp vs px

React Native's default unit is density-independent pixels (dp) while the web's default is pixels (px). These two units are different, however NativeWind treats them as if they are equivalent. Additionally, the NativeWind's compiler requires a unit for most numeric values forcing some styles to use a `px` unit. Generally this works fine, however you may need to use the platform modifiers (`web:`/`native:`/`ios:`/`android:`) to adjust per platform

## Flex

Flexbox works the same way in React Native as it does in CSS on the web, with a few exceptions. The defaults are different, with `flexDirection` defaulting to `column` instead of `row`, `alignContent` defaulting to `flex-start` instead of `stretch`, `flexShrink` defaulting to `0` instead of `1`, the `flex` parameter only supporting a single number.

We recommend explicitly setting the flex direction and using the className `flex-1` for consistent styles

## Yoga 2 vs 3

React Native previously flipped left/right (and start/end) edges when dealing with margin, padding, or border, set on a row-reverse container. In Yoga 3 (introduced in React Native 0.74) the behavior of these properties lines up with web.
