export default {
  env: {
    docsURL: '/_api',
  },
  head: {
    title: 'Diez - The cross-platform design system compiler',
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
    'highlight.js/styles/github.css',
  ],
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-90094131-5',
    }],
  ],
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'docs-*',
        path: '/docs/:version/*',
        component: resolve(__dirname, 'pages/docs.vue'),
      });
    },
  },
  hooks: {
    generate: {
      page (page) {
        const highlight = require('highlight.js');
        const {Examples} = require('./assets/examples');
        const position = page.html.indexOf('</body>');
        let out = '';

        if (Examples[page.route]) {
          Object.keys(Examples[page.route]).forEach((example) => {
            const h = highlight.highlight(example, Examples[page.route][example]);
            out += `<script type="text/template" id="${example}">${h.value}</script>`;
          });

          page.html = page.html.substring(0, position) + out + page.html.substring(position);
        }
      },
    },
  },
  loading: {
    color: '#5623EE',
  },
};
