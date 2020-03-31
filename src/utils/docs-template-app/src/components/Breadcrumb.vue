<template>
  <ul id="breadcrumb">
    <li v-for="crumb in crumbs" :key="`breadcrumb-${crumb}`">
      <router-link :to="getPathForCrumb(crumb)"><arrow size="15"/> {{crumb}}</router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Arrow from '@/assets/icons/Arrow.vue';
import {pathToArray, pathToCrumb} from '@/utils/navigation';
import {Component, Vue} from 'vue-property-decorator';

/**
 * Breadcrumb navigation.
 */
@Component({
  components: {
    Arrow,
  },
})
export default class Breadcrumb extends Vue {
  protected getPathForCrumb (crumb: string) {
    return pathToCrumb(this.$route.fullPath, crumb);
  }

  get crumbs () {
    return pathToArray(this.$route.fullPath);
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

li {
  display: inline-block;

  svg {
    transform: scale($breadcrumb-icon-scale);
    vertical-align: middle;
    margin: 0 $breadcrumb-icon-lateral-spacing-px;
  }

  a {
    @include breadcrumb-typograph();
    letter-spacing: 1.63px;
    text-decoration: none;
    &:hover {
      color: $palette-secondary-text;
    }
  }

  &:first-child svg {
    display: none;
  }
}
</style>
