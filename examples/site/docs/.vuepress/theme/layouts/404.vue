<template>
  <div class="errybody-lost shared">
    <div class="holster">
      <img src="../assets/imgs/404.svg" alt="404-lamp-illo">
      <h3 style="font-style:italic;">“Deep into that darkness peering, long I stood there, wondering, fearing, doubting, dreaming dreams no mortal ever dared to dream before.”</h3>
      <router-link class="button" to="/">...Get me out of here</router-link>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
  @import '@theme/styles/_utils.scss';

  img {
    width: 70%;
  }

  .errybody-lost {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 100vh;
    min-height: 600px;
  }

  .holster {
    width: 50%;
    @include phone {
      width: 100%;
    }
  }

</style>
