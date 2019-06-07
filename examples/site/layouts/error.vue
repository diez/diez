<template>
  <div class="errybody-lost">
    <div class="holster" v-if="error.statusCode === 404">
      <img src="@/assets/imgs/404.svg" alt="404-lamp-illo">
      <h3 style="font-style:italic;">“Deep into that darkness peering, long I stood there, wondering, fearing, doubting, dreaming dreams no mortal ever dared to dream before.”</h3>
      <NuxtLink class="button" to="/">…Get me out of here</NuxtLink>     
    </div>
    <div v-else>
      <h1 >An error occurred</h1>
      <nuxt-link to="/">Home page</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_shared.scss';
  @import '@/assets/styles/_utils.scss';

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
