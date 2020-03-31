<template>
  <div class="container">
    <nav>
      <ul>
        <tree-nav  v-for="tree in $treeRoot" :tree="tree" :depth="0" :key="tree.name" />
      </ul>
    </nav>

    <div class="gutter" ref="gutter"></div>

    <main>
      <search-form />
      <router-view/>
    </main>

    <div class="rightGutter" ref="rightGutter"></div>

    <aside>
      <code-examples />
    </aside>
  </div>
</template>

<script lang="ts">
import Split from 'split-grid';
import {Component, Vue} from 'vue-property-decorator';
import CodeExamples from './components/CodeExamples.vue';
import SearchForm from './components/SearchForm.vue';
import TreeNav from './components/TreeNav.vue';

/**
 * Default layout.
 */
@Component({
  components: {
    TreeNav,
    SearchForm,
    CodeExamples,
  },
})
export default class App extends Vue {
  mounted () {
    Split({
      columnGutters: [{
        track: 1,
        element: this.$refs.gutter as Element,
      }, {
        track: 3,
        element: this.$refs.rightGutter as Element,
      }],
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

.container {
  display: grid;
  grid-template-areas:
    "nav gutter main rightGutter aside";
  grid-template-columns: 280px 5px auto 5px 450px;
  height: 100vh;
}

.header, .search-bar, .options {
  border-bottom: 1px solid $palette-primary-border;
  padding: 12px 0;
  vertical-align: middle;
}

.header {
  grid-area: header;
  padding-left: 15px;
}

.search-bar {
  grid-area: search-bar;
}

.options {
  grid-area: options;
  padding-left: 5px;
  padding-right: 50px;
}

nav, main {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  &:hover {
    overflow-y: scroll;
    padding-right: 5px;
  }
}

nav {
  grid-area: nav;
  margin-left: 0.5rem;
  padding: 15px 10px;
  border-right: 1px solid $palette-primary-border;
  overflow-y: hidden;
  overflow-x: hidden;

  &:hover {
    overflow-y: auto;
  }
}

main {
  grid-area: main;
  min-width: 600px;
  padding: 0 10px 10px;
  position: relative;
}

aside {
  position: relative;
  height: 100%;
  grid-area: aside;
  border-left: 1px solid $palette-primary-border;
  padding-top: 6px;

  button {
    margin-bottom: 20px;
  }
}

.gutter, .rightGutter {
  background: transparent;
  grid-area: gutter;
  cursor: col-resize;

  &:hover {
    background: $palette-secondary-fill;
  }
}

.rightGutter {
  grid-area: rightGutter;
}
</style>
