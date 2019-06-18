const siteTitle = 'Diez - Cross-platform design system framework for native iOS, Android, and Web';
const siteDesc = 'Diez makes it easy to adopt a unified design language across codebases, platforms, and teams.';

module.exports = {
  additionalPages: [
    {
      path: '/',
      frontmatter: {
        layout: 'Home',
      },
    },
    {
      path: '/glossary/',
      frontmatter: {
        layout: 'Glossary',
      },
    },
    {
      path: '/signed-in/',
      frontmatter: {
        layout: 'SignedIn',
      },
    },
    {
      path: '/faq/',
      frontmatter: {
        layout: 'Faq',
      },
    },
    {
      path: '/analytics/',
      frontmatter: {
        layout: 'Analytics',
      },
    },
    {
      path: '/docs/',
      frontmatter: {
        layout: 'Docs',
      },
    },
  ],
  markdown: {
    anchor: {
      permalink: false,
    },
  },
  title: siteTitle,
  description: siteDesc,
  head: [
    ['meta', {charset: 'utf-8'}],
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    ['meta', {hid: 'description', name: 'description', content: siteDesc}],
    ['meta', {hid: 'og:image', property: 'og:image', content: 'http://diez.org/og.jpg'}],
    ['meta', {hid: 'og:title', property: 'og:title', content: siteTitle}],
    ['meta', {hid: 'og:description', property: 'og:description', content: siteDesc}],
    ['meta', {hid: 'og:url', property: 'og:url', content: 'http://diez.org/'}],
    ['meta', {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'}],
    ['link', {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}],
    [
      'link',
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,900|Source+Sans+Pro:400,400i,900&display=swap',
      },
    ],
  ],
  themeConfig: {
    docsURL: '/_api',
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-90094131-5',
      },
    ],
  ],
};
