import Docs from '@theme/layouts/Docs.vue';
import '@theme/styles/shared.scss';

export default ({router}) => {
  router.addRoutes([
    {
      name: 'docs-*',
      path: '/docs/:version/*',
      component: Docs,
    },
  ]);
};
