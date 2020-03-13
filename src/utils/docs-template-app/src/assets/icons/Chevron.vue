<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 20 20">
    <path d="M15 10l-9 5V5l9 5z" :fill="fill"/>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Chevron Icon
 */
@Component
export default class Chevron extends Vue {
  @Prop({default: 20}) readonly size!: number;
  @Prop() readonly fill!: string;
}
</script>
