<template>
  <div>
    <NavBar></NavBar>
    <div class="section">
      <DocVersionSelect />
      <div class="doc-embed-wrap">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DocVersionSelect from '@/components/DocVersionSelect.vue';
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';
import {Route} from 'vue-router';

@Component({
  components: {
    NavBar,
    DocVersionSelect,
  },
})
export default class Docs extends Vue {
  content = '';
  $route!: Route;

  created () {
    this.getContents();
  }

  async getContents () {
    if (process.server) {
      return;
    }

    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });

    // if no version provided, redirect to /latest
    if (!this.$route.params.version) {
      this.$router.push('/docs/latest/index.html');
    }

    try {
      // if no path provided, go to index
      const path = this.$route.params.pathMatch || 'index.html';
      const res = await fetch(`${process.env.docsURL}/${this.$route.params.version}/${path}`);
      this.$nuxt.$loading.finish();
      this.content = res.ok ? await res.text() : 'There was an error loading the article. Please try again later.';
    } catch {
      this.content = 'There was an error loading the article. Please try again later.';
      this.$nuxt.$loading.finish();
    }
  }
}
</script>

<style lang="scss">
  @import '@/assets/styles/_typedoc.scss';

  .doc-embed-wrap {
    position: relative;
    padding-left: 18px;
  }
</style>
