<template>
  <div>
    <h1>Sorry, we can't find that component.</h1>
    <p><router-link to="/">Take me home</router-link></p>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * Not found page.
 */
@Component
export default class NotFound extends Vue {
}
</script>
