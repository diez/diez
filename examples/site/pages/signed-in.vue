<template>
  <div>
    <NavBar></NavBar>
    <div class="page">
      <section class="content-holster">
        <h3>You were successfully signed in!</h3>
        <p>Please return to the command line to continue.</p>
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
  @import '@/assets/styles/_shared.scss';
  .content-holster {
    display: flex;
    min-height: calc(100vh - 100px);
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
