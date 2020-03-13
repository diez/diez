<template>
  <docs-item :tree="tree">
    <template v-slot:preview>
      <div class="image-wrapper">
        <img :src="`/${tree.properties.file4x.properties.src.value}`" :alt="tree.name">
      </div>
    </template>
    <template v-slot:extra>
      {{tree.name}}
    </template>
  </docs-item>
</template>

<script lang="ts">
import {DocsTargetSpec} from '@diez/docs';
import {ImageData} from '@diez/prefabs';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Image item view.
 */
@Component
export default class StringItem extends Vue {
  @Prop() readonly tree!: DocsTargetSpec<ImageData>;
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgIDxwYXRoIGZpbGw9IiNFNEU1RTYiIGQ9Ik0wIDBoMTN2MTNIMHoiLz4gICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzIDBoMTN2MTNIMTN6Ii8+ICAgIDxnPiAgICAgIDxwYXRoIGZpbGw9IiNFNEU1RTYiIGQ9Ik0yNiAyNkgxM1YxM2gxM3oiLz4gICAgICA8cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTMgMjZIMFYxM2gxM3oiLz4gICAgPC9nPiAgPC9nPjwvc3ZnPg==)!important;
}

img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
