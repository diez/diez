import fontLoader from './helpers/font-loader';

const siteTitle = 'Diez - Cross-platform design system framework for native iOS, Android, and Web';
const siteDesc = 'Diez makes it easy to adopt a unified design language across codebases, platforms, and teams.';

export default {
  env: {
    docsURL: '/_api',
  },
  generate: {
    routes: ['404'],
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'docs-*',
        path: '/docs/:version/*',
        component: resolve(__dirname, 'pages/docs.vue'),
      });
    },
  },
  head: {
    title: siteTitle,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: siteDesc},
      {hid: 'og:image', property: 'og:image', content: 'http://diez.org/og.jpg'},
      {hid: 'og:title', property: 'og:title', content: siteTitle},
      {hid: 'og:description', property: 'og:description', content: siteDesc},
      {hid: 'og:url', property: 'og:url', content: 'http://diez.org/'},
      {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,900|Source+Sans+Pro:400,400i,900&display=swap',
      },
    ],
    script: [{
      vmid: 'font-loader',
      type: 'application/javascript',
      innerHTML: fontLoader,
    }],
    __dangerouslyDisableSanitizers: ['script'],
  },
  css: [
    'modern-normalize/modern-normalize.css',
    'highlight.js/styles/github.css',
  ],
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-90094131-5',
    }],
    '@bazzite/nuxt-optimized-images',
  ],
  optimizedImages: {
    optimizeImages: true,
  },
  loading: {
    color: '#5623EE',
  },
};
