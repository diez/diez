<template>
  <svg width="10" height="16" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.982 8L.366 14.049a1.075 1.075 0 0 0 0 1.616c.488.447 1.28.447 1.768 0l7.5-6.857a1.075 1.075 0 0 0 0-1.616L2.134.335a1.334 1.334 0 0 0-1.768 0 1.075 1.075 0 0 0 0 1.616L6.982 8z" :fill="fill" fill-rule="nonzero"/>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Arrow Icon
 */
@Component
export default class Arrow extends Vue {
  @Prop({default: '#79738F'}) readonly fill!: string;
}
</script>
