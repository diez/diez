<template>
  <h1>Hello Diez!</h1>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';

@Component({
  components: {},
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_layout.scss';

h1 {
  color: rebeccapurple;
  margin-top: $example-size;
}
</style>
