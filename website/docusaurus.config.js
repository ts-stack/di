// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type-disable {import('@docusaurus/types').Config} */
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
        gtag: {
          trackingID: 'G-4X1PN2WDRF',
          // Optional fields.
          // anonymizeIP: true, // Should IPs be anonymized?
        },
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: ({ version, versionDocsDirPath, docPath, locale }) =>
          locale == 'en'
            ? `https://github.com/ts-stack/diedit/main/website/i18n/en/docusaurus-plugin-content-docs/${version}/${docPath}`
            : `https://github.com/ts-stack/di/edit/main/website/${versionDocsDirPath}/${docPath}`,
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
      navbar: {
        // title: 'Документація для @ts-stack/di',
        items: [
          {
            type: 'localeDropdown',
            position: 'right',
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
        copyright: `Copyright © ${new Date().getFullYear()} ts-stack, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
