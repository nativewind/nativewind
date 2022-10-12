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
    });
  }
);
