<template>
  <div v-if="hasExamples()" class="wrapper">
    <div class="nested-selects">
      <nested-selects :tree="component.examples" :selected="selectionTree" @change="updateSelectionTree"></nested-selects>
    </div>
    <div v-for="example of examples" :key="example.snippets[0].snippet">
      <div>
        <h3>{{example.example}}</h3>
        <p v-if="example.comment" v-html="example.comment"></p>
      </div>
      <tabbed-code :example="example" :activeLang="getActiveLang(example, activeLang)" @change="updateLang" />
    </div>
  </div>
  <div v-else class="wrapper wrapper--empty">
    <p>Select a single property to see its documentation</p>
  </div>
</template>

<script lang="ts">
import ProgrammingHoldCode from '@/assets/icons/ProgrammingHoldCode.vue';
import DynamicLoader from '@/components/DynamicLoader.vue';
import NestedSelects from '@/components/NestedSelects.vue';
import TabbedCode from '@/components/TabbedCode.vue';
import {findExampleFromSelection, hasExamples} from '@/utils/component';
import {storage} from '@/utils/storage';
import {Component, Mixins} from 'vue-property-decorator';

type ParsedExample = import('@diez/targets').ParsedExample;
type ParsedExampleTree = import('@diez/targets').ParsedExampleTree;

/**
 * Code examples for the current visible component.
 */
@Component({
  components: {
    ProgrammingHoldCode,
    NestedSelects,
    TabbedCode,
  },
})
export default class CodeExamples extends Mixins(DynamicLoader) {
  private selectionTree: string[] = [];
  private storageSelectionTreeKey = 'examples-selection-tree';
  private storageSelectedLangKey = 'examples-selected-lang';
  protected activeLang = '';
  protected examples: ParsedExampleTree | null = {};

  protected onUpdateStatus () {
    if (this.hasExamples()) {
      let tree = storage.getJson(this.storageSelectionTreeKey);

      if (!tree) {
        tree = this.pickStep(this.component!.examples!);
      }

      this.selectionTree = tree;
      this.examples = this.getExamples();
    }

    this.$forceUpdate();
  }

  protected updateSelectionTree (selection: string[], tree: ParsedExampleTree) {
    const newTree = this.pickStep(tree[selection[selection.length - 1]] as ParsedExampleTree);
    this.selectionTree = selection.concat(newTree);
    this.examples = this.getExamples();
    storage.setJson(this.storageSelectionTreeKey, this.selectionTree);
  }

  protected mounted () {
    this.onUpdateStatus();
  }

  protected getActiveLang (example: ParsedExample, activeLang: string) {
    const storedLang = activeLang || storage.get(this.storageSelectedLangKey);

    if (storedLang && example.snippets.some((s) => s.lang === storedLang)) {
      return storedLang;
    }

    const lang = example.snippets[0].lang;
    storage.set(this.storageSelectedLangKey, lang);
    return lang;
  }

  protected updateLang (lang: string) {
    this.activeLang = lang;
    storage.set(this.storageSelectedLangKey, lang);
  }

  private pickStep (node: ParsedExampleTree): string[] {
    if (Array.isArray(node)) {
      return [];
    }

    const step = Object.keys(node)[0];
    return [step, ...this.pickStep(node[step] as ParsedExampleTree)];
  }

  private getExamples () {
    return findExampleFromSelection(this.selectionTree, this.component);
  }

  private hasExamples () {
    return hasExamples(this.component);
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

.wrapper {
  padding: 14px 15px;

  &--empty {
    @include breadcrumb-typograph();
    padding: 14px 30px;
    font-size: 21px;
    line-height: 1.5;
    margin-top: -2px;
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
