import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "translate-x-0",
    {
      styles: {
        "translate-x-0": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "translate-y-0",
    {
      styles: {
        "translate-y-0": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "translate-x-px",
    {
      styles: {
        "translate-x-px": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 1 },
          ],
        },
      },
    },
  ],
  [
    "translate-y-px",
    {
      styles: {
        "translate-y-px": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 1 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "translate-x-1",
    {
      styles: {
        "translate-x-1": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 4 },
          ],
        },
      },
    },
  ],
  [
    "translate-y-1",
    {
      styles: {
        "translate-y-1": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 4 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  ...expectError([
    "translate-x-1/3",
    "translate-y-1/3",
    "translate-x-full",
    "translate-y-full",
  ]),
]);
