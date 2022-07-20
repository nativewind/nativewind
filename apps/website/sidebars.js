/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      id: "home",
      className: "home",
    },
    {
      type: "category",
      label: "Overview",
      collapsed: false,
      items: [
        "overview/overview",
        "overview/how-it-works",
        "guides/goals",
        // "overview/benchmarks",
      ],
    },
    {
      type: "category",
      label: "Quick Starts",
      collapsed: false,
      items: [
        "getting-started/typescript",
        "quick-starts/expo",
        "quick-starts/react-native-cli",
        "quick-starts/create-react-native-app",
        "quick-starts/nextjs",
        "quick-starts/solito",
        "quick-starts/ignite",
      ],
    },
    {
      type: "category",
      label: "Advanced Setup",
      collapsed: false,
      items: [
        "guides/babel",
        "guides/babel-compile-only",
        "guides/babel-transform-only",
        "guides/postcss",
        "guides/cli-native",
      ],
    },
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        "guides/theme-values",
        "guides/custom-components",
        "guides/tailwindcss-react-native",
      ],
    },
    {
      type: "category",
      label: "API",
      collapsed: false,
      items: [
        "api/styled",
        "api/StyledComponent",
        "api/use-color-scheme",
        "api/native-wind-style-sheet",
      ],
    },
    {
      type: "category",
      label: "Core concepts",
      collapsed: false,
      items: [
        "core-concepts/tailwindcss",
        "core-concepts/quirks",
        "core-concepts/platforms",
        "core-concepts/states",
        "core-concepts/responsive-design",
        "core-concepts/dark-mode",
        "core-concepts/units",
      ],
    },
    {
      type: "category",
      label: "Customization",
      collapsed: false,
      items: [
        "customization/configuration",
        "customization/content",
        "customization/theme",
        "customization/colors",
        "customization/babel",
      ],
    },
    {
      type: "category",
      label: "Layout",
      collapsed: false,
      items: [
        "tailwind/layout/aspect-ratio",
        "tailwind/layout/container",
        "tailwind/layout/display",
        "tailwind/layout/overflow",
        "tailwind/layout/position",
        "tailwind/layout/top-right-bottom-left",
        "tailwind/layout/z-index",
      ],
    },
    {
      type: "category",
      label: "Flexbox",
      collapsed: false,
      items: [
        "tailwind/flexbox/flex-basis",
        "tailwind/flexbox/flex-direction",
        "tailwind/flexbox/flex-wrap",
        "tailwind/flexbox/flex-grow",
        "tailwind/flexbox/flex-shrink",
        "tailwind/flexbox/gap",
        "tailwind/flexbox/justify-content",
        "tailwind/flexbox/align-content",
        "tailwind/flexbox/align-items",
        "tailwind/flexbox/align-self",
      ],
    },
    {
      type: "category",
      label: "Spacing",
      collapsed: false,
      items: [
        "tailwind/spacing/padding",
        "tailwind/spacing/margin",
        "tailwind/spacing/space-between",
      ],
    },
    {
      type: "category",
      label: "Sizing",
      collapsed: false,
      items: [
        "tailwind/sizing/width",
        "tailwind/sizing/min-width",
        "tailwind/sizing/max-width",
        "tailwind/sizing/height",
        "tailwind/sizing/min-height",
        "tailwind/sizing/max-height",
      ],
    },
    {
      type: "category",
      label: "Typography",
      collapsed: false,
      items: [
        "tailwind/typography/font-size",
        "tailwind/typography/font-style",
        "tailwind/typography/font-weight",
        "tailwind/typography/letter-spacing",
        "tailwind/typography/line-height",
        "tailwind/typography/text-align",
        "tailwind/typography/text-color",
        "tailwind/typography/text-decoration",
        "tailwind/typography/text-decoration-color",
        "tailwind/typography/text-decoration-style",
        "tailwind/typography/text-transform",
      ],
    },
    {
      type: "category",
      label: "Background",
      collapsed: false,
      items: ["tailwind/backgrounds/background-color"],
    },
    {
      type: "category",
      label: "Borders",
      collapsed: false,
      items: [
        "tailwind/borders/border-radius",
        "tailwind/borders/border-width",
        "tailwind/borders/border-color",
        "tailwind/borders/border-style",
        "tailwind/borders/divide-width",
        "tailwind/borders/divide-color",
        "tailwind/borders/divide-style",
      ],
    },
    {
      type: "category",
      label: "Effects",
      collapsed: false,
      items: ["tailwind/effects/box-shadow", "tailwind/effects/opacity"],
    },
    {
      type: "category",
      label: "Transforms",
      collapsed: false,
      items: [
        "tailwind/transforms/scale",
        "tailwind/transforms/rotate",
        "tailwind/transforms/translate",
        "tailwind/transforms/skew",
        "tailwind/transforms/transform-origin",
      ],
    },
    {
      type: "category",
      label: "SVG",
      collapsed: false,
      items: [
        "tailwind/svg/fill",
        "tailwind/svg/stroke",
        "tailwind/svg/stroke-width",
      ],
    },
  ],
};
module.exports = sidebars;
