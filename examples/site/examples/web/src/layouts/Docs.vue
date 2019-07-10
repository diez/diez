<template>
  <div>
    <NavBar></NavBar>
    <div class="docs-container section">
      <DocsVersionSelect />
      <div class="doc-embed-wrap">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DocsVersionSelect from '@theme/components/DocsVersionSelect.vue';
import NavBar from '@theme/components/NavBar.vue';

export default {
  components: {
    NavBar,
    DocsVersionSelect
  },
  data () {
    return {
      content: ''
    };
  },

  created () {
    this.getContents();
  },

  methods: {
    async getContents () {
      if (typeof window === 'undefined') {
        return;
      }

      if (!this.$route.params.version) {
        this.$router.push('/docs/latest/index.html');
      }

      try {
        // if no path provided, go to index
        const path = this.$route.params.pathMatch || 'index.html';
        const res = await window.fetch(`${this.$site.themeConfig.docsURL}/${this.$route.params.version}/${path}`);
        this.$data.content = res.ok ? await res.text() : 'There was an error loading the article. Please try again later.';
      } catch (e) {
        this.$data.content = 'There was an error loading the article. Please try again later.';
      }
    }

  }
};
</script>

<style lang="scss">
  @import '@theme/styles/_typedoc.scss';
  .doc-embed-wrap {
    position: relative;
    padding-left: 18px;
  }
</style>
