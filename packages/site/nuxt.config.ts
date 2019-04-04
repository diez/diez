export default {
  env: {},
  head: {
    title: 'Diezjs - The cross-platform design system compiler',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {
        hid: 'description',
        name: 'description',
        content: 'Diez enables you to use a single design system to power your native iOS, Android, and web codebases.',
      },
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
    ],
  },
  css: [
    'modern-normalize/modern-normalize.css',
  ],
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-REPLACE-ME',
    }],
  ],
  build: {},
};
