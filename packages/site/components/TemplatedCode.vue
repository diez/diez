<template>
  <pre>
    <code ref="content" :lang="template"></code>
  </pre>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'nuxt-property-decorator';

@Component
export default class TemplatedCode extends Vue {
  @Prop(String) template!: string

  mounted () {
    this.fetchTemplate();
  }

  updated () {
    this.fetchTemplate();
  }

  fetchTemplate () {
    const template = document.getElementById(this.$props.template);

    if (template) {
      (this.$refs.content as Element).innerHTML = template.innerHTML;
    }
  }
}
</script>
