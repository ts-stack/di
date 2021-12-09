// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en'],
    localeConfigs: {
      uk: {
        label: 'Українська',
      },
      en: {
        label: 'English',
      },
    },
  },
  title: '@ts-stack/di',
  tagline: 'Dinosaurs are cool',
  url: 'https://ts-stack.github.io',
  baseUrl: '/di/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ts-stack', // Usually your GitHub org/user name.
  projectName: 'di', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/ts-stack/di/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      gtag: {
        trackingID: 'G-4X1PN2WDRF',
        // Optional fields.
        // anonymizeIP: true, // Should IPs be anonymized?
      },
      navbar: {
        title: 'Документація для @ts-stack/di',
        items: [
          {
            type: 'localeDropdown',
            position: 'left',
          },
          {
            href: 'https://github.com/ts-stack/di',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
