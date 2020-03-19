<template>
  <div>
    <ul>
      <li
        v-for="snippet in example.snippets"
        :key="snippet.snippet"
        @click="notifyChanges(snippet.lang)"
        :class="{active: snippet.lang === (selectedSnippet && selectedSnippet.lang)}"
      >
        {{snippet.lang}}
      </li>
    </ul>
    <pre><code v-if="selectedSnippet" v-html="selectedSnippet.snippet"></code></pre>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
// import {ParsedExample, ParsedSnippet} from '../api';
type ParsedExample = import('@diez/targets').ParsedExample;
type ParsedSnippet = import('@diez/targets').ParsedSnippet;

/**
 * Code blobs with tabs.
 */
@Component
export default class TabbedCode extends Vue {
  @Prop() readonly example!: ParsedExample;
  @Prop() readonly activeLang!: string;
  protected selectedLang: string | null = null;
  protected selectedSnippet: ParsedSnippet | null = null;

  protected mounted () {
    this.selectLang(this.activeLang);
  }

  @Watch('activeLang')
  private selectLang (lang: string) {
    this.selectedLang = lang;
    this.selectedSnippet = this.example.snippets.find((snippet) => snippet.lang === lang) || null;
  }

  protected notifyChanges (lang: string) {
    this.selectLang(lang);
    this.$emit('change', lang);
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

pre {
  margin: 0;
}

code {
  @include code-typograph();
  @include code-panel();
  display: block;
  padding: 15px;
  margin: 0;
  width: 100%;
  overflow: hidden;
  border-bottom-right-radius: $corner-radii-base-px;
  border-bottom-left-radius: $corner-radii-base-px;
  border-top-right-radius: $corner-radii-base-px;

  &:hover {
    /* `overflow-overlay` is deprecated an only works in webkit/blink browsers, but is our best
     * shot to the scroll behavior we want: an horizontal scrollbar that is only displayed on
     * hover but doesn't take space.
     * Please keep both properties to ensure we get the best behavior across browsers.
     *
     * TODO: watch out and migrate to `scrollbar-gutter` which is on standards track but not usable yet.
    */
    overflow: auto;
    overflow: overlay;
  }
}

ul {
  display: flex;
}

li {
  @include code-tabs-panel();
  color: $palette-contrast-text;
  padding: 5px 10px;
  margin-right: 8px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top: 5px solid transparent;
  transition: background .14s ease;
  cursor: pointer;
  user-select: none;

  &.active {
    @include code-tabs-panel-active();
    border-color: $palette-electric-violet;
    color: $palette-primary-text;
  }
}
</style>
