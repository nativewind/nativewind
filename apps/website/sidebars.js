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
        "overview/benchmarks",
      ],
    },
    {
      type: "category",
      label: "Quick Starts",
      collapsed: false,
      items: [
        "quick-starts/expo",
        "quick-starts/react-native-cli",
        "quick-starts/create-react-native-app",
      ],
    },
    {
      type: "category",
      label: "Setup",
      collapsed: false,
      items: [
        "getting-started/editor",
        "getting-started/typescript",
        "guides/babel",
        "guides/babel-compile-only",
        "guides/babel-transform-only",
        "guides/postcss",
        "guides/cli-native",
        "guides/postcss-native",
      ],
    },
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: ["guides/theme-values", "guides/tailwindcss-react-native"],
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
        "api/use-tailwind",
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
        {
          type: "link",
          label: "Flex Direction",
          href: "https://tailwindcss.com/docs/flex-direction",
        },
        {
          type: "link",
          label: "Flex Wrap",
          href: "https://tailwindcss.com/docs/flex-wrap",
        },
        {
          type: "link",
          label: "Flex Grow",
          href: "https://tailwindcss.com/docs/flex-grow",
        },
        {
          type: "link",
          label: "Flex Shrink",
          href: "https://tailwindcss.com/docs/flex-shrink",
        },
        "tailwind/flexbox/gap",
        {
          type: "link",
          label: "Justify Content",
          href: "https://tailwindcss.com/docs/justify-content",
        },
        {
          type: "link",
          label: "Align Content",
          href: "https://tailwindcss.com/docs/align-content",
        },
        {
          type: "link",
          label: "Align Items",
          href: "https://tailwindcss.com/docs/align-items",
        },
        {
          type: "link",
          label: "Align Self",
          href: "https://tailwindcss.com/docs/align-self",
        },
      ],
    },
    {
      type: "category",
      label: "Spacing",
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Padding",
          href: "https://tailwindcss.com/docs/padding",
        },
        {
          type: "link",
          label: "Margin",
          href: "https://tailwindcss.com/docs/margin",
        },
        "tailwind/spacing/space-between",
      ],
    },
    {
      type: "category",
      label: "Sizing",
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Width",
          href: "https://tailwindcss.com/docs/width",
        },
        {
          type: "link",
          label: "Min-Width",
          href: "https://tailwindcss.com/docs/min-width",
        },
        {
          type: "link",
          label: "Max-Width",
          href: "https://tailwindcss.com/docs/max-width",
        },
        {
          type: "link",
          label: "Height",
          href: "https://tailwindcss.com/docs/height",
        },
        {
          type: "link",
          label: "Min-height",
          href: "https://tailwindcss.com/docs/min-height",
        },
        {
          type: "link",
          label: "Max-height",
          href: "https://tailwindcss.com/docs/max-height",
        },
      ],
    },
    {
      type: "category",
      label: "Typography",
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Font Size",
          href: "https://tailwindcss.com/docs/font-size",
        },
        {
          type: "link",
          label: "Font Style",
          href: "https://tailwindcss.com/docs/font-style",
        },
        {
          type: "link",
          label: "Font Weight",
          href: "https://tailwindcss.com/docs/font-weight",
        },
        {
          type: "link",
          label: "Letter spacing",
          href: "https://tailwindcss.com/docs/letter-spacing",
        },
        "tailwind/typography/line-height",
        {
          type: "link",
          label: "Letter spacing",
          href: "https://tailwindcss.com/docs/letter-spacing",
        },
        {
          type: "link",
          label: "Text Align",
          href: "https://tailwindcss.com/docs/text-align",
        },
        "tailwind/typography/text-color",
        "tailwind/typography/text-decoration",
        "tailwind/typography/text-decoration-color",
        "tailwind/typography/text-decoration-style",
        {
          type: "link",
          label: "Text Transform",
          href: "https://tailwindcss.com/docs/text-transform",
        },
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
        {
          type: "link",
          label: "Border Radius",
          href: "https://tailwindcss.com/docs/border-radius",
        },
        {
          type: "link",
          label: "Border Width",
          href: "https://tailwindcss.com/docs/border-width",
        },
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
      items: [
        {
          type: "link",
          label: "Box Shadow",
          href: "https://tailwindcss.com/docs/box-shadow",
        },
        {
          type: "link",
          label: "Opacity",
          href: "https://tailwindcss.com/docs/opacity",
        },
      ],
    },
    {
      type: "category",
      label: "Transforms",
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Scale",
          href: "https://tailwindcss.com/docs/scale",
        },
        {
          type: "link",
          label: "Rotate",
          href: "https://tailwindcss.com/docs/rotate",
        },
        {
          type: "link",
          label: "Translate",
          href: "https://tailwindcss.com/docs/translate",
        },
        {
          type: "link",
          label: "Skew",
          href: "https://tailwindcss.com/docs/skew",
        },
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
