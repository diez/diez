<template>
  <div>
    <NavBar></NavBar>
    <div class="page">
      <section class="content-holster">
        <H1>Congratulations, you're signed in!</H1>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue';
import {Component, Vue} from 'nuxt-property-decorator';

@Component({
  components: {NavBar},
})
export default class FigmaAuth extends Vue {

}
</script>

<style lang="scss" scoped>

  h1 {
    text-align: center;
  }

  .content-holster {
    display: flex;
    min-height: calc(100vh - 100px);
    align-items: center;
    justify-content: center;
  }
</style>
