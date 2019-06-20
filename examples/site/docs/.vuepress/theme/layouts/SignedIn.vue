<template>
  <div>
    <NavBar></NavBar>
    <div class="page shared">
      <section class="content-holster">
        <h3>You were successfully signed in!</h3>
        <p>Please return to the command line to continue.</p>
      </section>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  components: {NavBar}
};
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
    flex-direction: column;
  }
</style>
