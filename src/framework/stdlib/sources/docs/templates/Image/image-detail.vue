<template>
  <docs-detail :tree="tree" :details="details">
    <figure>
      <div class="image-wrapper">
        <img :src="`/${tree.properties.file.properties.src.value}`" :alt="tree.name">
      </div>
    </figure>
  </docs-detail>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec<ImageData>;

/**
 * Image Detail view.
 */
@Component
export default class ImageDetail extends Vue {
  @Prop() readonly tree!: DocsTargetSpec;

  get details () {
    return {
      Name: this.tree.name,
    };
  }
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgIDxwYXRoIGZpbGw9IiNFNEU1RTYiIGQ9Ik0wIDBoMTN2MTNIMHoiLz4gICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzIDBoMTN2MTNIMTN6Ii8+ICAgIDxnPiAgICAgIDxwYXRoIGZpbGw9IiNFNEU1RTYiIGQ9Ik0yNiAyNkgxM1YxM2gxM3oiLz4gICAgICA8cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTMgMjZIMFYxM2gxM3oiLz4gICAgPC9nPiAgPC9nPjwvc3ZnPg==)!important;
}
</style>
