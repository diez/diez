<template>
  <div id="app">
    <img :src="component.image.url">
    <h1 :style="{color: component.palette.hello, fontFamily: 'Roboto-Black'}">{{ component.copy }}</h1>
    <p :style="component.textStyle">Text style!</p>
    <div ref="haiku"></div>
    <div ref="lottie"></div>
  </div>
</template>

<script lang="ts">
import {Diez, MyStateBag} from 'diez';
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class App extends Vue {
  private diez = new Diez<MyStateBag>(MyStateBag);
  private component!: MyStateBag;

  beforeMount () {
    this.diez.attach((component: MyStateBag) => {
      this.component = component;
    });
  }

  mounted () {
    this.component.haiku.mount(this.$refs.haiku);
    this.component.lottie.mount(this.$refs.lottie);
  }
}
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}

iframe {
  border: none;
}
</style>
