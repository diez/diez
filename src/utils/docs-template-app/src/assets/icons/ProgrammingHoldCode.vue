<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g :fill="fill" fill-rule="nonzero">
      <path d="M13.59 17.098l7.545-.575a.804.804 0 0 1 .343 1.554l-10.433 3.912a2.241 2.241 0 0 1-1.5.028l-7.994-2.665a.75.75 0 0 0-.474 1.424L9.07 23.44a3.74 3.74 0 0 0 2.5-.047l10.434-3.912a2.305 2.305 0 0 0-.985-4.454l-7.544.575a.75.75 0 0 0 .114 1.496z"/>
      <path d="M6.564 17.814h5.788a2.085 2.085 0 0 0 .549-4.094L6.962 12.1c-.73-.2-1.495-.24-2.243-.116l-3.528.588a.75.75 0 0 0 .246 1.48l3.527-.588a3.76 3.76 0 0 1 1.603.083l5.939 1.62a.585.585 0 0 1-.154 1.147H6.564a.75.75 0 1 0 0 1.5zM9.18 3.566a.75.75 0 0 0-.9-1.2l-3.666 2.75c-.4.3-.4.9 0 1.2l3.666 2.75a.75.75 0 0 0 .9-1.2l-2.866-2.15 2.866-2.15zM17.447 7.866a.75.75 0 1 0 .9 1.2l3.667-2.75c.4-.3.4-.9 0-1.2l-3.667-2.75a.75.75 0 1 0-.9 1.2l2.867 2.15-2.867 2.15zM13.495.985l-1.833 9.167a.75.75 0 1 0 1.47.294l1.833-9.167a.75.75 0 0 0-1.47-.294z"/>
    </g>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * ProgrammingHoldCode Icon
 */
@Component
export default class ProgrammingHoldCode extends Vue {
  @Prop({default: 24}) readonly size!: number;
  @Prop() readonly fill!: string;
}
</script>
