/* eslint-disable @cspell/spellchecker */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "NativeWind",
  tagline: "",
  url: "https://nativewind.dev/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "marklawlor", // Usually your GitHub org/user name.
  projectName: "NativeWind", // Usually your repo name.

  clientModules: [
    require.resolve("./src/remark-snackplayer/snack-initializer.js"),
  ],

  scripts: [
    { src: "https://cdn.splitbee.io/sb.js", defer: true },
    { src: "https://snack.expo.dev/embed.js", defer: true },
  ],

  plugins: ["docusaurus-plugin-sass"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: false,
          editUrl: `https://github.com/marklawlor/nativewind/edit/main/website/`,
          remarkPlugins: [require("./src/remark-snackplayer")],
          routeBasePath: "/", // disable landing page
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "G6PSHR6HYU",
        apiKey: "e179290d52cea5f4751ae76dd1f40b4f",
        indexName: "nativewind",
        contextualSearch: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "NativeWind",
        logo: {
          alt: "NativeWind Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            href: "https://github.com/marklawlor/nativewind",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/marklawlor/nativewind",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mark Lawlor. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
