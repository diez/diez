<script>
import TabTitles from '@theme/components/TabTitles.vue';

const activeClass = 'active';

export default {
  components: {
    TabTitles
  },
  mounted () {
    this.$root.$on('tabChanged', this.changeTab);
  },
  beforeDestroy () {
    this.$root.$off('tabChanged', this.changeTab);
  },
  methods: {
    changeTab (tabName) {
      const active = this.$el.querySelector(`.tabContents .${activeClass}`);
      const newActive = this.$el.querySelector(`.tabContents .tabname-${tabName}, .tabContents .language-${tabName}`);

      if (active && newActive) {
        active.classList.remove(activeClass);
        newActive.classList.add(activeClass);
      }
    },
    inferTabName (prefix, className) {
      return new RegExp(`${prefix}-([a-zA-Z]+)`).exec(className);
    }
  },
  render (h) {
    const titles = this.$slots.default.map(({data}) => {
      const tabName = this.inferTabName('tabname', data.staticClass);

      if (tabName) {
        return tabName[1];
      }

      const language = this.inferTabName('language', data.staticClass);

      if (language) {
        return language[1];
      }

      return Math.random().toString();
    });

    this.$slots.default[0].data.staticClass += ' active';

    return h('div', {class: {wrapper: true}}, [
      h('TabTitles', {props: {titles}}),
      h('div', {class: {tabContents: true}}, this.$slots.default)
    ]);
  }
};
</script>

<style lang="scss" scoped>
@import '@theme/styles/_utils.scss';

.wrapper {
  margin-top: $spacing-xl-px;
}

[class^='language-']:not(.active):not(pre) {
  display: none;
}
</style>
