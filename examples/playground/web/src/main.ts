import vue from 'vue';
import AppVue from './App.vue';

vue.config.productionTip = false;

new vue({
  render: (h) => h(AppVue),
}).$mount('#app');
