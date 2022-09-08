// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Pocket documentation",
  tagline: "Pocket money for the Web3",
  url: "https://gopocket.fr",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Pocket",
        logo: {
          alt: "Pocket Logo",
          src: "img/favicon.ico",
        },
        items: [
          { to: "/faq", label: "FAQ", position: "left" },
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Tutorial",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://gopocket.fr",
            label: "Pocket app",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Glossary",
                to: "/docs/glossary",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Linkedin",
                href: "https://linkedin.com/company/0xpocket",
              },
              {
                label: "Discord",
                href: "https://discord.gg/VGBv7E4h",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/0xPocket",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "test",
                to: "/test",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Pocket, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
