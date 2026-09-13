# Nativewind v5 RC compatibility notes

Draft for the Expo 57 RC. The release is still under audit and has not been published.

The target is Expo 57.0.22 with React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. The intended package pair is Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0. Installation instructions become active only after that exact pair is published.

## Corrections to the preview documentation

Several preview tables describe CSS utilities as fully supported even though the engine's original tests explicitly reject them on native platforms. The RC retains those rejection contracts. These are existing limitations, not newly supported features or regressions introduced by the Expo upgrade.

| Utilities | Native behavior and migration |
| :--- | :--- |
| `border-inherit`, `text-inherit`, `caret-inherit`, `decoration-inherit` | Explicit CSS `inherit` is rejected. Use an explicit value or a CSS variable shared with the relevant styled ancestor. This differs from ordinary nested Text inheritance. |
| `border-none`, `outline-double` | These border and outline styles are rejected. `border-0` removes the border by setting its width. |
| `basis-auto`, `inset-auto`, `inset-x-auto`, `inset-y-auto` | These utility values are rejected. Use the appropriate React Native layout props or omit the constraint. |
| `order-first`, `order-last`, `order-none` | CSS flex order is rejected. Arrange native children in the intended order. |
| `overflow-auto`, `overflow-clip`, `overflow-scroll`, all `overflow-x-*` and `overflow-y-*` entries listed in the audit | CSS scroll containers and axis specific overflow are rejected. Use React Native scrolling components or the supported whole view overflow behavior. |
| `fixed`, `sticky` | CSS position values are rejected. Use native layout, overlay or sticky header APIs appropriate to the component. They are not interchangeable with CSS viewport positioning. |
| `w-min`, `w-max`, `w-fit`, `h-min`, `h-max`, `h-fit`, and the corresponding min/max size forms | Intrinsic CSS size keywords are rejected. Use native flex layout or explicit dimensions. |
| The nine named `origin-*` utilities | CSS transform origin is rejected by this compiler. Where needed, configure React Native's `transformOrigin` style directly. |
| `decoration-wavy`, `overline` | These text decoration values are rejected. |
| `align-baseline`, `align-text-top`, `align-text-bottom`, `align-sub`, `align-super` | These CSS vertical alignment values are rejected. Native text layout has a different contract. |

The exact literal inventory and expected warning values are recorded in the compatibility repository's `release/documented-native-rejections.json`. Each listed utility must still be discovered from a real TSX file and safely rejected in both development and production. A deliberate width declaration must make its rejection check fail. Browser support is evaluated independently; this table makes no new browser support claim.

## API and runtime corrections

The RC removes stale v4 ambient declarations for `cssInterop`, `placeholderClassName`, `indicatorClassName`, `presentationClassName`, and a standalone StatusBar `className`. They did not correspond to v5 runtime mappings. Use `styled` mappings for custom components and the documented `placeholder:` utility for TextInput placeholder color. KeyboardAvoidingView now maps `contentContainerClassName` to `contentContainerStyle`; React Native uses that container with `behavior="position"`.

Nested style mappings preserve both independent target paths and caller owned objects. Attribute selectors use full class tokens, CSS whitespace boundaries, exact language matching and explicit ASCII case flags. Dynamic `clamp()` respects its minimum when bounds cross. Dynamic two color mixing preserves existing alpha and correctly normalizes explicit percentages.

The theme now emits the correct foreground ripple property, preserves numeric ripple radii alongside ripple colors, and converts `corner-rounded` to the engine's circular corner value. Ripple properties apply to Android Pressable components; corner curves use the iOS host style.

An animation name supplied through a CSS variable now resolves to keyframes before it reaches Reanimated. Missing or invalid names are omitted safely, and fallback, removal, restoration and `none` are covered by regression tests.

Use React Native Appearance and `useColorScheme` for native dark mode. The deprecated Nativewind hook delegates to Appearance during migration. The v4 class dark mode configuration is rejected with migration guidance.

## Verification boundaries

Parameterized preview entries such as `w-[n]` describe a value category, not permission to use every CSS expression. The RC audit records the supported domain and representative rendering examples for each reviewed pattern.

| Value category | Native qualification |
| :--- | :--- |
| Layout and spacing | Numeric scale tokens and supported px, rem or em lengths. Percentages apply only where the native property accepts them. Intrinsic size keywords, unknown units and mixed percentage arithmetic are excluded. |
| Colors | Configured color tokens, hexadecimal, RGB and HSL colors, plus the reviewed variable and color mixing forms. `currentColor` reads CSS color utilities or variables; inline native color is not its source. |
| Borders and outlines | Widths are nonnegative native lengths. Corner radii are circular. The selected iOS outline scenes require rounded corners; the original square corner gap remains disclosed. |
| Transforms | Planar angles, numeric scale multipliers and supported translations. Scale percentage tokens become numbers. No general 3D transform support is implied. |
| Fonts | The first family is used on native. Load custom fonts before rendering. Font size and line height still depend on native metrics and font scaling. Percentage and calc line height forms rejected by the compiler are excluded. |
| SVG | Fill and stroke examples include an explicit component prop mapping. Third party components need their own mappings. |

On the default stable iOS runtime, filters other than brightness and opacity require an experimental React Native host flag. This RC does not enable that flag. Tailwind gradients with explicit `oklab` interpolation are browser only because the pinned native background image processor rejects that syntax. Use a native gradient component when that effect is needed on iOS or Android.

Static screenshots and geometry establish only the recorded component, values and states. Controlled safe area metrics do not prove physical rotation; visibility tests do not establish screen reader announcements. Native filter and text decoration support varies by platform. Computed browser properties are labeled separately from visible rendering and user interaction.

Browser cursor checks verify computed properties because screenshots do not capture the system cursor. The selected Firefox and WebKit backdrop checks also verify computed properties where plain CSS screenshot controls are insensitive. Firefox overscroll containment and WebKit snap stopping remain unverified as behavior. Touch gestures are tested in Chromium; those gesture results do not establish Firefox or WebKit behavior. WebKit rendering for the selected `divide-solid` and `divide-double` scenes remains unverified. The compatibility report retains these gaps alongside the independently required passing cells.

Android animation cancellation remains tracked in [Reanimated issue 10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). Changing a running rotation to animationName none or removing its animation styles can retain the final transform. Isolated none checks can pass, so a passing isolated example does not resolve the defect. The exact Android animate-none reset case is explicitly excluded from passing support claims; iPhone and browser cancellation and every other required motion case remain independently verified. No local Reanimated patch is included. Physical Android verification was waived; the Android Release emulator and physical iPhone remain required.

See [release notes](expo57-rc.md) for the exact installation commands and audit status. The public v4 to v5 migration skill follows RC delivery and must be verified against the released packages.

The remaining browser documentation is tested as explicit examples. Rendering hints such as will-change, font smoothing and OpenType feature selection are checked as computed declarations. Those checks do not promise performance improvements, specific font glyphs or rasterization. Print fragmentation and automatic hyphenation also remain limited to computed declarations; printer pagination and language dictionary behavior are outside this RC claim.

Native physical corner radii use the configured native rem. For example, the default Tailwind radius-lg is 0.5rem, which is 7 points with the default native rem of 14 and 8 pixels in the standard browser fixture. Named font families refer to platform font choices or an explicitly loaded font, rather than arbitrary font installation or numeric font weights.

The pinned Reanimated built in View, Text, Image, ScrollView and FlatList components retain their identities when CSS animation styles are applied. This avoids an extra wrapper after Reanimated stopped using the older display name prefix. Custom animated components created by applications have no public upstream marker, so automatic identity recognition for every custom wrapper is not claimed.

Parsed CSS animation declarations can contain multiple names and timing values. Runtime custom properties used as entire animation shorthands currently support the enumerated common name, duration, easing and iteration forms. Arbitrary token permutations or multiple animations inside a single custom property are outside this RC contract. Native motion evidence records the actual screenshot timing interval; it does not imply frame precise capture on a physical device.

Vertical alignment in the original fixed height Text example is an Android property. The pinned React Native implementation maps it to textAlignVertical. CSS inline alignment on the web uses a separate browser context, and this example does not establish iOS vertical text alignment.

## ARIA state props

Use the public hyphenated React Native prop for ARIA modifiers, for example `<View aria-selected={selected} className="aria-selected:bg-blue-500" />`. The engine matches the incoming prop before React Native translates accessibility properties for the host. `accessibilityState={{ selected }}` does not activate `aria-selected:` in this RC; use `aria-selected` for both accessibility and styling. `ariaSelected` is not the public React Native prop. The audit retains failures for both historical spellings and requires the public example to pass initial, changed and restored state checks. This is an explicit migration qualification, not restored compatibility with those old fixtures.

## Interaction qualifications

The release audit checks touch routing against independent reference presses; focus and active group modifiers retain initial, changed and restored states. Native `select-all` and `select-auto` certify that Text selection is enabled. They do not promise CSS selection expansion semantics. The caret color contract uses Android TextInput `cursorColor`; it does not claim the same prop works on iOS. White, explicit red and CSS current color examples are sampled across seven cursor blink frames. Browser caret paint is outside that native check. Android ripple colors and borderless extent use six frames during a held press. Responsive and safe area rotation require an actual window orientation change.

## Browser component and reference limits

For the original React Native Web Image and Expo Image object fitting examples, use resizeMode or contentFit/contentPosition props on web. Class mapping to the outer View does not certify the nested image renderer. Native image adapter and HTML img utility checks are separate.

The original WebKit backface example and Firefox select-all drag reference remain unverified. WebKit select-none requires the explicit WebkitUserSelect:none style in the pinned engine. The generated utility alone does not prevent selection there. These exact historical nonpassing examples are retained as limitations, with native and other browser coverage required independently.

All three pinned browsers ignore break-before:all and break-after:all; Firefox also ignores avoid-page and column. Matching ignored declarations is recorded as an unsupported fallback, not pagination support. Native animation capture retains the layout effect and mount callback as separate checkpoints. The required trajectory samples start after that callback, with at least two initial observations within 100 milliseconds and the original 60 millisecond tolerance.
