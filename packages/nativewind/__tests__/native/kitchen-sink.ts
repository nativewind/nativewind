import { testCompile } from "../test-utils";

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
  // Backgrounds - Gradient Color Stops
  bg-gradient-to-r from-transparent
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
  border-none
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
  // Effects - Mix Blend Mode
  mix-blend-normal
  // Effects - Opacity
  opacity-5
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
  // Filters - Grayscale
  grayscale
  // Filters - Hue Rotate
  hue-rotate-15
  // Filters - Invert
  invert
  // Layout - Position
  absolute
  // Filters - Saturate
  saturate-50
  // Filters - Sepia
  sepia
  // Layout - Isolation
  isolate
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
  // Layout -  Fit
  object-contain
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
  // Layout - Grid Auto Columns
  auto-cols-min
  // Layout - Grid Auto Flow
  grid-flow-row
  // Layout - Grid Auto Row
  auto-rows-auto
  // Layout - Grid Column Start / End
  col-span-1
  // Layout - Grid Row Start / End
  row-span-1
  // Layout - Grid Template Columns
  grid-cols-1
  // Layout - Grid Template Row
  grid-rows-1
  // Layout - Justify Content
  Justify-center
  // Layout - Justify Items
  justify-items-start
  // Layout - Justify Items
  justify-self-start
  // Layout - Margin
  m-1
  // Layout - Padding
  p-1
  // Layout - Place Items
  place-items-start
  // Layout - Place Self
  place-self-start
  // Layout -  Position
  object-bottom
  // Layout - Order
  order-1
  // Layout - Overflow
  overflow-hidden
  // Layout - Overscroll Behavior
  overscroll-contain
  // Layout - Top Right Bottom Left
  inset-1
  // Layout - Visibility
  invisible
  // Layout - Z-Index
  z-10
  // Interactivity - Caret Color
  caret-black
  // Interactivity - Cursor
  cursor-pointer
  // Interactivity - Pointer Events
  Interactivity - Pointer Events
  // Interactivity - Resize
  resize
  // Interactivity - Scroll Behavior
  scroll-smooth
  // Interactivity - Scroll Margin
  scroll-m-1
  // Interactivity - Scroll Padding
  scroll-p-1
  // Interactivity - Scroll Snap Align
  snap-start
  // Interactivity - Scroll Snap Stop
  snap-normal
  // Interactivity - Scroll Snap TTypography - Whitespace
  snap-x
  snap-mandatory
  // Interactivity - Touch Action
  touch-pan-x
  // Interactivity - Touch Action
  select-text
  // Interactivity - Will Change
  will-change-scroll
  // Sizing - Height
  h-1
  h-max
  // Sizing - Max-Width
  max-w-full
  // Sizing - Min-Width
  min-w-full
  // Sizing - Width
  w-screen
  // Tables - Border Collapse
  border-collapse
  // Tables - Table Layout
  table-fixed
  // Transforms - Rotate
  rotate-45
  // Transforms - Scale
  scale-50
  // Transforms - Skew
  skew-x-1
  // Transforms - Translate
  translate-x-px
  // Transforms - Transform Origin
  origin-top
  // Transitions & Animation - Transition Delay
  delay-75
  // Transitions & Animation - Transition Duration
  duration-75
  // Transitions & Animation - Transition Property
  transition-all
  // Transitions & Animation - Transition Timing Function
  ease-linear
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
  // Typography - Line Height
  leading-3
  leading-tight
  // Typography - List Style Position
  list-inside
  // Typography - List Style Type
  list-disc
  // Typography - Text Align
  text-center
  // Typography - Text Color
  text-black
  text-black/50
  // Typography - Text Decoration
  underline
  // Typography - Text Decoration Color
  decoration-black
  // Typography - Text Decoration Style
  decoration-solid
  // Typography - Text Decoration Thickness
  decoration-0
  // Typography - Text Indent
  indent-px
  // Typography - Text Overflow
  text-ellipsis
  // Typography - Text Transform
  uppercase
  // Typography - Text Underline Offset
  underline-offset-1
  // Typography - Text Decoration Thickness
  decoration-1
  // Typography - Vertical Alignment
  align-baseline
  // Typography - Whitespace
  whitespace-normal
  // Typography - Word Break
  break-normal
  `,
  {
    name: "Kitchen sink",
  },
  (output) => {
    expect(output).toStrictEqual({
      absolute: {
        styles: [
          {
            position: "absolute",
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
      "basis-1": {
        styles: [
          {
            flexBasis: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        subscriptions: ["--rem"],
      },
      "bg-black": {
        styles: [
          {
            backgroundColor: "#000",
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
      "border-none": {
        styles: [
          {
            borderWidth: 0,
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
        subscriptions: ["--device-width"],
      },
      "content-around": {
        styles: [
          {
            alignContent: "space-around",
          },
        ],
      },
      "content-between": {
        styles: [
          {
            alignContent: "space-between",
          },
        ],
      },
      "content-center": {
        styles: [
          {
            alignContent: "center",
          },
        ],
      },
      "content-end": {
        styles: [
          {
            alignContent: "flex-end",
          },
        ],
      },
      "content-start": {
        styles: [
          {
            alignContent: "flex-start",
          },
        ],
      },
      "decoration-black": {
        styles: [
          {
            textDecorationColor: "#000",
          },
        ],
      },
      "decoration-solid": {
        styles: [
          {
            textDecorationStyle: "solid",
          },
        ],
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
      flex: {
        styles: [
          {
            display: "flex",
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
      "h-1": {
        styles: [
          {
            height: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        subscriptions: ["--rem"],
      },
      hidden: {
        styles: [
          {
            display: "none",
          },
        ],
      },
      "inset-1": {
        styles: [
          {
            bottom: {
              function: "rem",
              values: [0.25],
            },
            left: {
              function: "rem",
              values: [0.25],
            },
            right: {
              function: "rem",
              values: [0.25],
            },
            top: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        subscriptions: ["--rem"],
      },
      italic: {
        styles: [
          {
            fontStyle: "italic",
          },
        ],
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
      "leading-3": {
        styles: [
          {
            lineHeight: {
              function: "rem",
              values: [0.75],
            },
          },
        ],
        subscriptions: ["--rem"],
      },
      "leading-tight": {
        styles: [
          {
            lineHeight: 1.25,
          },
        ],
      },
      "m-1": {
        styles: [
          {
            margin: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        subscriptions: ["--rem"],
      },
      "max-w-full": {
        styles: [
          {
            maxWidth: "100%",
          },
        ],
      },
      "min-w-full": {
        styles: [
          {
            minWidth: "100%",
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
      "opacity-5": {
        styles: [
          {
            opacity: 0.05,
          },
        ],
      },
      "overflow-hidden": {
        styles: [
          {
            overflow: "hidden",
          },
        ],
      },
      "p-1": {
        styles: [
          {
            padding: {
              function: "rem",
              values: [0.25],
            },
          },
        ],
        subscriptions: ["--rem"],
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
        subscriptions: ["--rem"],
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
      shadow: {
        styles: [
          {
            elevation: 3,
            shadowColor: {
              function: "toRGB",
              values: ["rgba(0, 0, 0, 0.1)"],
            },
            shadowOffset: {
              height: 2,
              width: 0,
            },
            shadowRadius: 6,
            shadowOpacity: {
              function: "rgbOpacity",
              values: ["rgba(0, 0, 0, 0.1)"],
            },
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
        subscriptions: ["--rem"],
      },
      "text-black": {
        styles: [
          {
            color: "#000",
          },
        ],
      },
      "text-black/50": {
        styles: [
          {
            color: "rgba(0, 0, 0, 0.5)",
          },
        ],
      },
      "text-center": {
        styles: [
          {
            textAlign: "center",
          },
        ],
      },
      uppercase: {
        styles: [
          {
            textTransform: "uppercase",
          },
        ],
      },
      "w-screen": {
        styles: [
          {
            width: {
              function: "vw",
              values: [100],
            },
          },
        ],
        subscriptions: ["--window-width"],
      },

      "font-bold": {
        styles: [
          {
            fontWeight: "700",
          },
        ],
      },

      "rotate-45": {
        styles: [
          {
            transform: [
              {
                rotate: 45,
              },
            ],
          },
        ],
      },

      "scale-50": {
        styles: [
          {
            transform: [
              {
                scale: 0.5,
              },
            ],
          },
        ],
      },

      "skew-x-1": {
        styles: [
          {
            transform: [
              {
                skewX: 1,
              },
            ],
          },
        ],
      },

      "translate-x-px": {
        styles: [
          {
            transform: [
              {
                translate: 1,
              },
            ],
          },
        ],
      },

      "shadow-red-500": {
        styles: [
          {
            shadowColor: "#ef4444",
          },
        ],
      },

      underline: {
        styles: [
          {
            textDecorationLine: "underline",
          },
        ],
      },
      "z-10": {
        styles: [
          {
            zIndex: 10,
          },
        ],
      },
    });
  }
);
