import {capitalize, prefabPlural} from '@/filters';
import 'normalize.css';
import Vue from 'vue';
import App from './App.vue';
import './assets/styles/global.scss';
import DocsDetail from './components/DocsDetail.vue';
import DocsItem from './components/DocsItem.vue';
import router from './router';

Vue.filter('capitalize', capitalize);
Vue.filter('prefabPlural', prefabPlural);

Vue.component('docs-item', DocsItem);
Vue.component('docs-detail', DocsDetail);

Vue.config.productionTip = false;

(async () => {
  const tree = await fetch('/assets/tree.json');
  Vue.prototype.$treeRoot = await tree.json();

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
})();
