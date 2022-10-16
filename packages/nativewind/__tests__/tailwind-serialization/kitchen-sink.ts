import { testCompile } from "../utilities";

testCompile(
  `
  // Accent
  accent-white
  // Align Content
  content-center
  content-start
  content-end
  content-between
  content-around
  content-evenly
  // Align items
  items-start
  items-end
  items-center
  items-baseline
  items-stretch
  // Align self
  self-auto
  self-start
  self-end
  self-center
  self-stretch
  self-baseline
  // Animations
  animate-none
  animate-spin
  animate-ping
  animate-pulse
  animate-bounce
  // Appearance
  appearance-none
  // Aspect Ratio
  aspect-square
  aspect-video
  // Backgrounds - Background Attachment
  bg-fixed
  // Backgrounds - Background Clip
  bg-clip-border
  // Backgrounds - Background Image
  bg-gradient-to-t
  // Backgrounds - Background Origin
  bg-origin-border
  // Backgrounds - Background Position
  bg-center
  // Backgrounds - Background Repeat
  bg-repeat-x
  // Backgrounds - Background Size
  bg-cover
  // Border - Border Color
  border-black
  // Border - Border Radius
  rounded
  // Border - Border Style
  border-solid
  // Border - Border Width
  border-2
  // Border - Divide Color
  divide-black
  // Border - Divide Style
  divide-solid
  // Border - Divide Width
  divide-x
  // Effects - Background Blend Mode
  bg-blend-normal
  // Effects - Box Shadow
  shadow
  // Effects - Box shadow Color
  shadow-red-500
  // Filters - Backdrop Blur
  backdrop-blur
  // Filters - Backdrop Brightness
  backdrop-brightness-50
  // Filters - Backdrop Brightness
  backdrop-contrast-50
  // Filters - Backdrop Grayscale
  backdrop-grayscale
  // Filters - Backdrop Hue Rotate
  backdrop-hue-rotate-15
  // Filters - Backdrop Invert
  backdrop-invert-0
  // Filters - Backdrop Opacity
  backdrop-opacity-5
  // Filters - Backdrop Saturate
  backdrop-saturate-50
  // Filters - Backdrop Saturate
  backdrop-sepia
  // Filters - Blur
  blur
  // Filters - Brightness
  brightness-50
  // Filters - Drop Shadow
  drop-shadow
  // Layout - Box Decoration Break
  box-decoration-clone
  // Layout - Box Sizing
  box-border
  // Layout - Break After
  break-after-auto
  // Layout - Break Before
  break-before-auto
  // Layout - Break Inside
  break-inside-auto
  // Layout - Clear
  clear-right
  // Layout - Columns
  columns-1
  // Layout - Container
  container
  // Layout - Display
  flex
  hidden
  // Layout - Flex Basis
  basis-1
  // Layout - Flex Direction
  flex-row
  // Layout - Flex Grow
  grow
  // Layout - Flex Shrink
  shrink
  // Layout - Flex Wrap
  flex-wrap
  // Layout - Flex
  flex
  flex-auto
  flex-initial
  flex-none
  // Layout - Float
  float-right
  // Interactivity - Caret Color
  caret-black
  // Interactivity - Cursor
  cursor-pointer
  // Tables - Border Collapse
  border-collapse
  // Typography - Background Color
  bg-black
  // Typography - Content
  content-none
  // Typography - Font Size
  text-base
  // Typography - Font Smoothing
  antialiased
  // Typography - Font Style
  italic
  not-italic
  // Typography - Font Weight
  font-bold
  `,
  {
    name: "Kitchen sink",
  },
  (output) => {
    expect(output).toStrictEqual({
      "content-around": {
        styles: [{ alignContent: "space-around" }],
      },
      "content-between": {
        styles: [{ alignContent: "space-between" }],
      },
      "content-center": {
        styles: [{ alignContent: "center" }],
      },
      "content-end": {
        styles: [{ alignContent: "flex-end" }],
      },
      "content-start": {
        styles: [{ alignContent: "flex-start" }],
      },
      "items-baseline": {
        styles: [
          {
            alignItems: "baseline",
          },
        ],
      },
      "items-center": {
        styles: [
          {
            alignItems: "center",
          },
        ],
      },
      "items-end": {
        styles: [
          {
            alignItems: "flex-end",
          },
        ],
      },
      "items-start": {
        styles: [
          {
            alignItems: "flex-start",
          },
        ],
      },
      "items-stretch": {
        styles: [
          {
            alignItems: "stretch",
          },
        ],
      },

      "self-baseline": {
        styles: [
          {
            alignSelf: "baseline",
          },
        ],
      },
      "self-center": {
        styles: [
          {
            alignSelf: "center",
          },
        ],
      },
      "self-end": {
        styles: [
          {
            alignSelf: "flex-end",
          },
        ],
      },
      "self-start": {
        styles: [
          {
            alignSelf: "flex-start",
          },
        ],
      },
      "self-stretch": {
        styles: [
          {
            alignSelf: "stretch",
          },
        ],
      },
      "aspect-square": {
        styles: [
          {
            aspectRatio: 1,
          },
        ],
      },
      "aspect-video": {
        styles: [
          {
            aspectRatio: 1.777777778,
          },
        ],
      },
      "bg-black": {
        styles: [
          {
            backgroundColor: "#000",
          },
        ],
      },
      "border-black": {
        styles: [
          {
            borderColor: "#000",
          },
        ],
      },
      "border-solid": {
        styles: [
          {
            borderStyle: "solid",
          },
        ],
      },

      shadow: {
        atRules: {
          "0": [["platform", "android"]],
          "1": [["platform", "ios"]],
        },
        styles: [
          {
            elevation: 3,
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: {
              height: 2,
              width: 0,
            },
            shadowRadius: 6,
          },
          {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: {
              height: 2,
              width: 0,
            },
            shadowRadius: 6,
          },
        ],
      },
      "border-2": {
        styles: [
          {
            borderWidth: 2,
          },
        ],
      },
      rounded: {
        styles: [
          {
            borderRadius: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        topics: ["--rem"],
      },

      flex: {
        styles: [
          {
            display: "flex",
          },
        ],
      },
      hidden: {
        styles: [
          {
            display: "none",
          },
        ],
      },

      container: {
        atRules: {
          "1": [["min-width", 640]],
          "2": [["min-width", 768]],
          "3": [["min-width", 1024]],
          "4": [["min-width", 1280]],
          "5": [["min-width", 1536]],
        },
        styles: [
          {
            width: "100%",
          },
          {
            maxWidth: 640,
          },
          {
            maxWidth: 768,
          },
          {
            maxWidth: 1024,
          },
          {
            maxWidth: 1280,
          },
          {
            maxWidth: 1536,
          },
        ],
        topics: ["device-width"],
      },

      "divide-black": {
        childClasses: ["divide-black:children"],
        styles: [],
      },
      "divide-black:children": {
        conditions: ["not-first-child"],
        styles: [
          {
            borderColor: "#000",
          },
        ],
      },
      "divide-solid": {
        childClasses: ["divide-solid:children"],
        styles: [],
      },
      "divide-solid:children": {
        conditions: ["not-first-child"],
        styles: [
          {
            borderStyle: "solid",
          },
        ],
      },
      "divide-x": {
        childClasses: ["divide-x:children"],
        styles: [],
      },
      "divide-x:children": {
        conditions: ["not-first-child"],
        styles: [
          {
            borderLeftWidth: 1,
            borderRightWidth: 0,
          },
        ],
      },

      "basis-1": {
        styles: [
          {
            flexBasis: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        topics: ["--rem"],
      },

      "flex-row": {
        styles: [
          {
            flexDirection: "row",
          },
        ],
      },
      "flex-wrap": {
        styles: [
          {
            flexWrap: "wrap",
          },
        ],
      },

      grow: {
        styles: [
          {
            flexGrow: 1,
          },
        ],
      },
      shrink: {
        styles: [
          {
            flexShrink: 1,
          },
        ],
      },
      "flex-auto": {
        styles: [
          {
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
          },
        ],
      },
      "flex-initial": {
        styles: [
          {
            flexBasis: "auto",
            flexGrow: 0,
            flexShrink: 1,
          },
        ],
      },
      "flex-none": {
        styles: [
          {
            flexBasis: "auto",
          },
        ],
      },

      "text-base": {
        styles: [
          {
            fontSize: {
              function: "rem",
              values: [1],
            },
            lineHeight: {
              function: "rem",
              values: [1.5],
            },
          },
        ],
        topics: ["--rem"],
      },

      italic: {
        styles: [
          {
            fontStyle: "italic",
          },
        ],
      },
      "not-italic": {
        styles: [
          {
            fontStyle: "normal",
          },
        ],
      },
    });
  }
);
