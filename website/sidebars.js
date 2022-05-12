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
    "introduction",
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "quick-start",
        "installation",
        {
          type: "category",
          label: "Compilation",
          collapsed: true,
          items: [
            "compilation/babel",
            "compilation/babel-compile-only",
            "compilation/cli-native",
            "compilation/postcss-native",
          ],
        },
        {
          type: "category",
          label: "Frameworks",
          collapsed: true,
          items: ["frameworks/expo", "frameworks/nextjs", "frameworks/solito"],
        },
      ],
    },
    {
      type: "category",
      label: "API",
      collapsed: true,
      items: [
        "api/styled",
        "api/StyledComponent",
        "api/tailwind-provider",
        "api/use-tailwind",
      ],
    },
    {
      type: "category",
      label: "Configuration",
      collapsed: true,
      items: ["configuration/babel", "configuration/postcss"],
    },
    {
      type: "category",
      label: "Preview features",
      collapsed: true,
      items: ["compilation/postcss-css", "compilation/cli-css"],
    },
    {
      type: "html",
      value: "<hr />",
    },
    {
      type: "html",
      value: `<details style="padding-bottom:10px;"><summary>Legend</summary>

<p style="margin-top: 5px">Tailwind CSS classes not present are not supported.</p>

  <table style="width:100%;display: table;">
    <tbody>
      <tr>
        <th style="padding: 5px 12px; font-size: 0.8em;">Icon</th>
        <th></th>
      </tr>
      <tr>
        <td><svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-next-theme-IconExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg></td>
        <td style="padding: 0px 12px; font-size: 0.8em;">Full support <br/> Links to tailwindcss.com</td>
      </tr>
      <tr>
        <td>🆕</td>
        <td style="padding: 0px 12px; font-size: 0.8em;">New feature</td>
      </tr>
      <tr>
        <td>⭐</td>
        <td style="padding: 0px 12px; font-size: 0.8em;">New concepts / Featured</td>
      </tr>
      <tr>
        <td>⚠️ </td>
        <td style="padding: 0px 12px; font-size: 0.8em;">Differnt functionality</td>
      </tr>
    </tbody>
  </table>
</details>`,
    },
    {
      type: "category",
      label: "Core concepts",
      collapsible: false,
      items: [
        "tailwind/core-concepts/pseudo-classes",
        "tailwind/core-concepts/component",
      ],
    },
    {
      type: "category",
      label: "Layout",
      collapsible: false,
      items: [
        {
          type: "link",
          label: "Aspect ratio",
          href: "https://tailwindcss.com/docs/aspect-ratio",
        },
        {
          type: "link",
          label: "Container",
          href: "https://tailwindcss.com/docs/container",
        },
        "tailwind/layout/display",
        "tailwind/layout/overflow",
        "tailwind/layout/position",
        {
          type: "link",
          label: "Top / Right Bottom Left",
          href: "https://tailwindcss.com/docs/top-right-bottom-left",
        },
        "tailwind/layout/z-index",
      ],
    },
    {
      type: "category",
      label: "Flexbox",
      collapsible: false,
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
      collapsible: false,
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
      collapsible: false,
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
      collapsible: false,
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
      collapsible: false,
      items: ["tailwind/backgrounds/background-color"],
    },
    {
      type: "category",
      label: "Borders",
      collapsible: false,
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
      collapsible: false,
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
      collapsible: false,
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
  ],
};
module.exports = sidebars;
