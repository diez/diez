<template>
  <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
    <g fill-rule="nonzero">
      <path d="M5.25.996h16.5A2.25 2.25 0 0 1 24 3.246v16.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.746v-16.5A2.25 2.25 0 0 1 5.25.996zm0 1.5a.75.75 0 0 0-.75.75v16.5c0 .414.336.75.75.75h16.5a.75.75 0 0 0 .75-.75v-16.5a.75.75 0 0 0-.75-.75H5.25z"/>
      <path d="M20.25 23.496h-18a.75.75 0 0 1-.75-.75v-18a.75.75 0 0 0-1.5 0v18a2.25 2.25 0 0 0 2.25 2.25h18a.75.75 0 1 0 0-1.5z"/>
      <path d="M12 15.246V8.5a1.502 1.502 0 0 0-2.398-1.201L7.8 8.65a.75.75 0 1 0 .9 1.2l1.8-1.35v6.746a.75.75 0 1 0 1.5 0z"/>
      <path d="M9.75 15.996h3a.75.75 0 1 0 0-1.5h-3a.75.75 0 1 0 0 1.5zM19.5 13a3 3 0 1 1-6 0v-3a3 3 0 0 1 6 0v3zM18 13v-3a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0 3 0z"/>
    </g>
  </svg>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * Icon representing a 'number' primitive.
 */
@Component
export default class NumberIcon extends Vue {
}
</script>
