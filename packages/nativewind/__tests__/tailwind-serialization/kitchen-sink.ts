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
  // Effects - Background Blend Mode
  bg-blend-normal
  // Tables - Border Collapse
  border-collapse
  // Typography - Background Color
  bg-black
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
    });
  }
);
