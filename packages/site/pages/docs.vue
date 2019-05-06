<template>
  <div>
    <NavBar></NavBar>
    <div class="doc-embed-wrap">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';
import {Route} from 'vue-router';

@Component({
  components: {
    NavBar,
  },
})
export default class Docs extends Vue {
  content = 'Loading...';
  $route!: Route;

  created () {
    this.getContents();
  }

  async getContents () {
    if (process.server) {
      return;
    }

    // if no version provided, redirect to /latest
    if (!this.$route.params.version) {
      this.$router.push('/docs/latest/');
    }

    try {
      // if no path provided, go to index
      const path = this.$route.params.pathMatch || 'index.html';
      const res = await fetch(`${process.env.docsURL}/${this.$route.params.version}/${path}`);
      this.content = await res.text();
    } catch {
      this.content = 'There was an error loading the article. Please try again later.';
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/styles/_layout.scss';

  .tsd-navigation {
    top: $spacing3XL + $spacingXL!important;
  }

  .doc-embed-wrap {
    margin-top: $spacing3XL + $spacingXL;
  }
</style>
