<template>
  <div class="version-select">
    <select @change="versionChanged">
      <option
        v-for="version in versionHistory"
        :value="version.name.includes('latest') ? 'latest' : version.version"
        :key="version.version"
        :selected="version.version === currentVersion"
      >
        {{version.name}}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import versionHistory from '@/data/diez-versions.json';
import {Component, Vue} from 'nuxt-property-decorator';
@Component
export default class DocVersionSelect extends Vue {
  versionHistory = versionHistory;
  get currentVersion () {
    if (this.$route && this.$route.params && this.$route.params.version) {
      return this.$route.params.version;
    }
    return '';
  }
  versionChanged (event: any) {
    this.$router.push(`/docs/${event.target.value}/index.html`);
  }
}
</script>

<style lang="scss" scoped>
.version-select {
  margin: 80px 0 0 18px;
}
</style>