<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="size" :height="size" :class="klass">
    <path d="M18.961 6.828L12 10.855 5.039 6.828l6.456-3.689c.112-.064.232-.105.355-.125a.988.988 0 0 1 .654.124zm-7.435 16.133a.997.997 0 0 0 .952-.002c.356-.058.701-.18 1.017-.36l7.001-4.001a2.987 2.987 0 0 0 1.299-1.514c.133-.342.202-.707.205-1.084V8a2.98 2.98 0 0 0-.314-1.334.996.996 0 0 0-.253-.417 3.05 3.05 0 0 0-.928-.842l-7.009-4.005a2.987 2.987 0 0 0-1.953-.364 3.046 3.046 0 0 0-1.038.363L3.504 5.402a3 3 0 0 0-.941.85 1.025 1.025 0 0 0-.251.417A3.07 3.07 0 0 0 2 7.993V16c.001.71.248 1.364.664 1.878.23.286.512.528.831.715l7.009 4.005c.324.187.67.307 1.022.362zM11 12.587v7.991l-6.495-3.711a1.05 1.05 0 0 1-.285-.244A.985.985 0 0 1 4 16V8.538zm2 7.991v-7.991l7-4.049V16a1.035 1.035 0 0 1-.07.362.984.984 0 0 1-.426.5z" :fill="fill"/>
  </svg>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Box Icon
 */
@Component
export default class Box extends Vue {
  @Prop({default: 24}) readonly size!: number;
  @Prop() readonly klass!: string;
  @Prop() readonly fill!: string;
}
</script>
