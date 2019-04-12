<template>
  <div class="page">
    <NavBar></NavBar>
    <h1>Hello Diez, bro!</h1>
    <p>yo thi sis my paragraph</p>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
import NavBar from '@/components/NavBar.vue';

@Component({
  components: {NavBar},
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_layout.scss';
</style>
