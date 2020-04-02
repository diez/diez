import Vue from 'vue';
import Router from 'vue-router';
import DesignLanguage from './views/DesignLanguage.vue';
import SearchResults from './views/SearchResults.vue';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/search',
      name: 'search',
      component: SearchResults,
    },
    {
      path: '*',
      name: 'design-language',
      component: DesignLanguage,
      beforeEnter (to, from, next) {
        if (to.fullPath === '/') {
          next(Vue.prototype.$treeRoot[0].id);
        }

        next();
      },
    },
  ],
});

export default router;
